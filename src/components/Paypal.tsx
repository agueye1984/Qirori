import { Component, useState } from "react";


export default class Paypal extends Component {
    state = {
        accesToken: null,
        approvalUrl: null,
        paymentId: null
    }

    componentDidMount() {
        const dataDetail = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": "30.11",
                    "currency": "USD",
                    "details": {
                        "subtotal": "30.00",
                        "tax": "0.07",
                        "shipping": "0.03",
                        "handling_fee": "1.00",
                        "shipping_discount": "-1.00",
                        "insurance": "0.01"
                    }
                }
            }],
            "redirect_urls": {
                "return_url": "https://example.com/return",
                "cancel_url": "https://example.com/cancel"
            }
        }

        fetch('https://api.sandbox.paypal.com/v1/oauth2/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorisation': `Bearer A21AALZPmKblZXA4k-pQWbHf3ZEz1Io7bquyThqM2Sz-iCXZcC-_SHORrp-aR0s4C9TsKph0ABeLUQP_Yj7CiEjswReonxX2g`
                },
                body: 'grant_type=client_credentials'
            }

        )
            .then(res => res.json())
            .then(response => {
                console.log("response", response);
                this.setState({ accessToken: response.access_token })

                fetch('https://api.sandbox.paypal.com/v1/payments/payment',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorisation': `Bearer ${response.access_token}`
                        },
                        body: JSON.stringify(dataDetail)
                    }
                )
                    .then(res => res.json())
                    .then(response => {
                        console.log("response", response);
                        const { id, links } = response;
                        const approvalUrl = links.find((data: any) => data.rel == "approval_url");
                        console.log("approvalUrl", approvalUrl);
                        this.setState({
                            paymentId: id,
                            approvalUrl: approvalUrl.href
                        })
                    }).catch(err => {
                        console.log(...err);
                    })
            }).catch(err => {
                console.log(...err);
            })
    }


    _onNavigationStateChange = (webViewState: any) => {
        console.log("webViewState", webViewState);
        if (webViewState.url.includes('https://example.com/')) {
            this.setState({
                approvalUrl: null
            })

            const { PayerID, paymentId, uri } = webViewState.url

            fetch(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, {
                method: 'POST',
                body: { payer_id: PayerID, uri: uri },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorisation': `Bearer ${this.state.accesToken}`
                },

            })
            .then(res => res.json())
            .then(response => {
                console.log("res", response);
                if(response.name == "INVALID_RESOURCE_ID"){
                    console.log("Payment failed. Please Try Again");
                    this.setState({
                        approvalUrl: null
                    })
                    
                }
            }).catch(err => {
                console.log({ ...err })
            })
        }
    }
}


