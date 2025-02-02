import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Header from '../components/Header';
import React, {useEffect, useState} from 'react';
import {Commande, Contribution, TypeEvent, Event} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {theme} from '../core/theme';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {getRecordById} from '../services/FirestoreServices';

const Dashboards = () => {
  const {i18n, t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [nbrEvents, setNbrEvents] = useState(0);
  const [nbrInvites, setNbrInvites] = useState<any[]>([]);
  const [nbrDonations, setNbrDonations] = useState<any[]>([]);
  const [mntDonation, setMntDonation] = useState<any[]>([]);
  const [nbrOrderDone, setNbrOrderDone] = useState(0);
  const [nbrOrderGoing, setNbrOrderGoing] = useState(0);
  const [nbrOrderDeliver, setNbrOrderDeliver] = useState(0);
  const [nbrProduit, setNbrProduit] = useState(0);
  const [nbrService, setNbrService] = useState(0);
  const selectedLanguageCode = i18n.language;

  const screenWidth = Dimensions.get('window').width;

  const fetchData = async (eventId: string) => {
    try {
      const event = (await getRecordById('events', eventId)) as Event;

      const typeEvent = (await getRecordById(
        'type_events',
        event.name,
      )) as TypeEvent;

      let evenName = typeEvent.nameFr;
      if (selectedLanguageCode === 'en') {
        evenName = typeEvent.nameEn;
      }
      if (evenName === '' && selectedLanguageCode === 'en') {
        evenName = typeEvent.nameFr;
      }
      if (evenName === '' && selectedLanguageCode === 'fr') {
        evenName = typeEvent.nameEn;
      }
      return evenName;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    firestore()
      .collection('products')
      // Filter results
      .get()
      .then(querySnapshot => {
        setNbrProduit(querySnapshot.size);
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('services')
      // Filter results
      .get()
      .then(querySnapshot => {
        setNbrService(querySnapshot.size);
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('events')
      // Filter results
      .get()
      .then(querySnapshot => {
        setNbrEvents(querySnapshot.size);
      });
  }, []);
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const querySnapshot = await firestore().collection('invitations').get();
        const countByEvent: any = {};
        querySnapshot.forEach(doc => {
          const invitation = doc.data();
          const eventId = invitation.eventId;
          if (!countByEvent[eventId]) {
            countByEvent[eventId] = 0;
          }
          countByEvent[eventId]++;
        });

        const resultArray = await Promise.all(
          Object.keys(countByEvent).map(async eventId => {
            const eventName = await fetchData(eventId);
            return {
              name: eventName,
              population: countByEvent[eventId],
              color: `#${Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')}`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 10,
            };
          }),
        );

        setNbrInvites(resultArray);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvitations();
  }, [selectedLanguageCode]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('contributions')
          .get();
        const countByEvent: any = {};
        const mntByEvent: any = {};
        querySnapshot.forEach(doc => {
          const donate = doc.data() as Contribution;
          const eventId = donate.eventId;
          const mnt = donate.montant;
          if (!countByEvent[eventId]) {
            countByEvent[eventId] = 0;
          }
          if (!mntByEvent[eventId]) {
            mntByEvent[eventId] = 0;
          }
          countByEvent[eventId]++;
          mntByEvent[eventId] += Number(mnt);
        });

        const resultArray = await Promise.all(
          Object.keys(countByEvent).map(async eventId => {
            const eventName = await fetchData(eventId);
            return {
              name: eventName,
              population: countByEvent[eventId],
              color: `#${Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')}`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 10,
            };
          }),
        );
        setNbrDonations(resultArray);
        const resultArrayMnt = await Promise.all(
          Object.keys(mntByEvent).map(async eventId => {
            const eventName = await fetchData(eventId);
            return {
              name: eventName,
              population: mntByEvent[eventId],
              color: `#${Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')}`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 10,
            };
          }),
        );
        setMntDonation(resultArrayMnt);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContributions();
  }, [selectedLanguageCode]);

  useEffect(() => {
    firestore()
      .collection('commandes')
      // Filter results
      .get()
      .then(querySnapshot => {
        let nbOrderBeing = 0;
        let nbOrderLivre = 0;
        querySnapshot.forEach(doc => {
          const order = doc.data() as Commande;
          const statut = order.statut;
          if (['2', '3', '4'].includes(statut)) {
            nbOrderBeing++;
          }
          if (['4', '5'].includes(statut)) {
            nbOrderLivre++;
          }
        });
        setNbrOrderDone(querySnapshot.size);
        setNbrOrderGoing(nbOrderBeing);
        setNbrOrderDeliver(nbOrderLivre);
      });
  }, []);

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('LoginScreen' as never));
  };

  const styles = StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      padding:20,
    },
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: { fontWeight: 'bold', fontSize: 16 },
    customer: { marginVertical: 5 },
  });

  const data = [
    {
      key: 'header',
      component: (
        <Header>{t('DashboardList.Dashboards')}</Header>
      ),
    },
    {
      key: 'nb_events',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.customer}><Text style={styles.orderId}>{t('Dashboards.NbrEvents')} : </Text>{nbrEvents}</Text>
        </View>
      ),
    },
    {
      key: 'nb_invite_events',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.orderId}>{t('Dashboards.NbrInviteEvents')} : </Text>
         <PieChart
              data={nbrInvites}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
        </View>
      ),
    },
    {
      key: 'nb_donation_events',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.orderId}>{t('Dashboards.NbrDonationsEvents')} : </Text>
         <PieChart
              data={nbrDonations}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
        </View>
      ),
    },
    {
      key: 'mnt_donation_events',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.orderId}>{t('Dashboards.MntDonationsEvents')} : </Text>
         <PieChart
              data={mntDonation}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
        </View>
      ),
    },
    {
      key: 'nb_order_done',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.customer}><Text style={styles.orderId}>{t('Dashboards.NbrOrderDone')} : </Text>{nbrOrderDone}</Text>
        </View>
      ),
    },
    {
      key: 'nb_order_being',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.customer}><Text style={styles.orderId}>{t('Dashboards.NbrOrderBeing')} : </Text>{nbrOrderGoing}</Text>
        </View>
      ),
    },
    {
      key: 'nb_order_deliver',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.customer}><Text style={styles.orderId}>{t('Dashboards.NbrOrderDeliver')} : </Text>{nbrOrderDeliver}</Text>
        </View>
      ),
    },
    {
      key: 'nb_products',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.customer}><Text style={styles.orderId}>{t('Dashboards.NbrProducts')} : </Text>{nbrProduit}</Text>
        </View>
      ),
    },
    {
      key: 'nb_services',
      component: (
        <View style={styles.orderCard}>
         <Text style={styles.customer}><Text style={styles.orderId}>{t('Dashboards.NbrServices')} : </Text>{nbrService}</Text>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1
            name={'arrow-back-ios'}
            color={theme.colors.primary}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" color={theme.colors.primary} size={30} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({item}) => <View>{item.component}</View>}
        keyExtractor={item => item.key}
        contentContainerStyle={defaultStyles.scrollViewContent}
      />
      
    </SafeAreaView>
  );
};

export default Dashboards;
