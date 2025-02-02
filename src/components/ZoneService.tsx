import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import axios from 'axios';
import countryGeonameIds from '../services/countryGeonameIds.json'; // Importez le fichier JSON
import MultiSelect from 'react-native-multiple-select'

type Props = {
  region: string;
  setZoneService: (value: string[]) => void;
  defaultSelectedZones: string[];
  error: string
};

export const ZoneService = ({
  region,
  setZoneService,
  defaultSelectedZones,
  error
}: Props) => {
  const [state] = useStore();
  const countryCode = state.country.toString();
  const {i18n, t} = useTranslation();
  const {ColorPallet} = useTheme();
  const [regions, setRegions] = useState<{key: string; value: string}[]>([]);
  const [selectedZones, setSelectedZones] =
    useState<string[]>([]);
  const selectedLanguageCode = i18n.language;

   useEffect(() => {
    setSelectedZones(defaultSelectedZones);
   }, [defaultSelectedZones]);

  useEffect(() => {
    const fetchData = async () => {
      const geonameId = (countryGeonameIds as Record<string, number>)[
        countryCode
      ];
      if (region) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${region}&username=amadagueye&lang=${selectedLanguageCode}`;
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          });
          if (result) {
            // console.log(result)
            const regionList = result.data.geonames.map((region: any) => ({
              key: region.geonameId,
              value: region.name,
            }));
            regionList.sort((a: any, b: any) =>
              a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
            );
            setRegions(regionList);
          }
        } catch (e) {
          console.log('Error ' + e);
        }
      }
    };
    fetchData();
  }, [region]);

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
    multiSelectInputGroup: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    multiSelectContainer: {
      /* borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5, */
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
    multiSelectText: {
      textAlign: 'center',
    },
    errorBorder: {
      borderColor: 'red', // Bordure rouge en cas d'erreur
      borderWidth:1
    },
  });

  const handleZoneChange = (selectedZones: any[]) => {
    setSelectedZones(selectedZones);
    setZoneService(selectedZones);
  };

  return (
    <View>
      <MultiSelect
        items={regions}
        uniqueKey="key"
        onSelectedItemsChange={handleZoneChange}
        selectedItems={selectedZones}
        selectText={t('Dropdown.Zone')}
        searchInputPlaceholderText={t('Dropdown.Search')}
        hideSubmitButton={true}
        displayKey="value"
        styleDropdownMenuSubsection={
          error
            ? { ...styles.multiSelectContainer, ...styles.errorBorder }
            : styles.multiSelectContainer
        } // Appliquez des styles personnalisés ici
        styleInputGroup={styles.multiSelectInputGroup} // Pour centrer le placeholder
       // styleTextDropdown={styles.multiSelectText}
        styleTextDropdown={
          error
            ? { ...styles.multiSelectText, color: 'red' } // Texte en rouge en cas d'erreur
            : styles.multiSelectText
        }
      />
    </View>
  );
};
