import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View} from 'react-native'
import {MultipleSelectList, SelectList} from 'react-native-dropdown-select-list'
import {useStore} from '../contexts/store'
import {useTheme} from '../contexts/theme'
import {theme} from '../core/theme'
import axios from 'axios'
import countryGeonameIds from '../services/countryGeonameIds.json' // Importez le fichier JSON

type Props = {
  region: string;
  setZoneService: (value: string[]) => void
}

export const ZoneService = ({region, setZoneService}: Props) => {
  const [state] = useStore()
  const countryCode = state.country.toString()
  const {i18n, t} = useTranslation()
  const {ColorPallet} = useTheme()
  const [regions, setRegions] = useState<{key: string; value: string}[]>([])
  const selectedLanguageCode = i18n.language

 // console.log(zoneService)

  useEffect(() => {
    const fetchData = async () => {
      const geonameId = (countryGeonameIds as Record<string, number>)[countryCode]
      if (region) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${region}&username=amadagueye&lang=${selectedLanguageCode}`
        console.log(apiUrl)
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          })
          if (result) {
            // console.log(result)
            const regionList = result.data.geonames.map((region: any) => ({
              key: region.geonameId,
              value: region.name,
            }))
            regionList.sort((a: any, b: any) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()))
            setRegions(regionList)
          }
        } catch (e) {
          console.log('Error ' + e)
        }
      }
    }
    fetchData()
  }, [region])

  /* let transformed = categories.map(({id, name}) => ({key: id, value: name}));

  transformed.push({key: '', value: t('Dropdown.Category')});
  transformed.sort((a, b) =>
    a.key.toLowerCase().localeCompare(b.key.toLowerCase()),
  ); */

  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    buttonStyle: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    text: {
      textAlign: 'left',
    },
    dropdownStyle: {
      borderColor: ColorPallet.lightGray,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid',
      borderBottomLeftRadius: 4,
      maring: '0',
      borderBottomRightRadius: 4,
    },
  })


  return (
    <View>
       <MultipleSelectList
        boxStyles={styles.container}
            setSelected={(values:string[]) => setZoneService(values)}
            data={regions}
            search={true}
            save="key"
        placeholder={t('Dropdown.Zone')}
        dropdownTextStyles={{backgroundColor: theme.colors.surface}}
        inputStyles={{backgroundColor: theme.colors.surface}}
          />
     {/*  <MultipleSelectList
        boxStyles={styles.container}
        setSelected={(val: string) => setZoneService(val)}
        data={regions}
        search={true}
        save="key"
        placeholder={t('Dropdown.Zone')}
        defaultOption={defaultOption()}
        dropdownTextStyles={{backgroundColor: theme.colors.surface}}
        inputStyles={{backgroundColor: theme.colors.surface}}
      /> */}
    </View>
  )
}
