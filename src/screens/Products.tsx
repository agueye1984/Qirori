import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTheme } from '../contexts/theme'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { BacktoHome } from '../components/BacktoHome'
import { VentesList } from '../components/VentesList'
import { useNavigation } from '@react-navigation/native'
import { Accueil, Product } from '../contexts/types'
import { VentesItem } from '../components/VentesItem'
import { useStore } from '../contexts/store'
import { DataTable } from 'react-native-paper'
import { Table, Row } from 'react-native-table-component';
import { theme } from '../core/theme'


export const Products = () => {
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const { t } = useTranslation()
  const vente = VentesList(t)
  const { navigate } = useNavigation()
  const [state] = useStore()

  const tableData = {tableHead: [ 'Crypto Name', 'Crypto Symbol', 'Current Value', 'Movement', 'Mkt Cap', 'Description' ],
  widthArr: [140, 160, 180, 120, 220, 540 ],
                    }

  console.log(state)

  function handleSelection(item: Accueil) {
    navigate(item.route as never)
  }


  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    container: { flex: 1, paddingTop: 10, paddingHorizontal: 15 },
    head: { height: 44, backgroundColor: theme.colors.primary, color: 'white' },
    row: { height: 40 },
    headText: { fontSize: 12, fontWeight: 'bold' , textAlign: 'center', color: 'white' },
  })

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('Products.title')}</Header>
      <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
        <View style={{ padding: 10 }}>
          <View style={styles.container}>
          {/* <ScrollView horizontal={true}>
          <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: 'purple' }}>
                        <Row
                            data={tableData.tableHead}
                            widthArr={tableData.widthArr}
                            style={styles.head}
                        />
          </Table>
          </View>
          </ScrollView> */}
            <DataTable>
              <DataTable.Header style={styles.head} >
                <DataTable.Title textStyle={styles.headText}>{t('AddProduct.Name')}</DataTable.Title>
                <DataTable.Title numeric textStyle={styles.headText}>{t('AddProduct.PrixUnitaire')}</DataTable.Title>
                <DataTable.Title numeric textStyle={styles.headText}>{t('AddProduct.Quantite')}</DataTable.Title>
              </DataTable.Header>
              {state.products.map((item: Product, index: number) => {
                return <DataTable.Row style={styles.row} key={index}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.prixUnitaire} {item.devise}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantite}</DataTable.Cell>
                </DataTable.Row>
              })}
            </DataTable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
