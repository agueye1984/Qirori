import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import firestore from '@react-native-firebase/firestore';
import {TypeEvent} from '../contexts/types';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { TextInput as PaperTextInput } from 'react-native-paper';

type Props = {
  eventName: string;
  setEventName: (value: string) => void;
  current : any;
  error: string;
};

export const NameSection = ({eventName, setEventName, current, error}: Props) => {
  const [t, i18n] = useTranslation();
  const {ColorPallet} = useTheme();
  const [selectAutre, setSelectAutre] = useState(false);
  const [event, setEvent] = useState<TypeEvent[]>([]);
  const selectedLanguageCode = i18n.language;
  const defaultStyles = DefaultComponentsThemes();

  useEffect(() => {
    var db = firestore()
    var typeEventsRef = db.collection("type_events") 
    let query = typeEventsRef.where('nameEn', '!=', '');
    if(selectedLanguageCode=='fr'){
      query = typeEventsRef.where('nameFr', '!=', '');
    }
      query.get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setEvent([]);
        } else {
          const events: TypeEvent[] = [];
          querySnapshot.forEach(documentSnapshot => {
            events.push(documentSnapshot.data() as TypeEvent);
          });
          setEvent(events);
        }
      });
  }, []);

  let transformed = event.map(e => ({
    key: e.id,
    value: e.nameFr,
  }));
  if (selectedLanguageCode == 'en') {
    transformed = event.map(e => ({
      key: e.id,
      value: e.nameEn,
    }));
  }
  transformed.push({key: '', value: t('Dropdown.Event')});
  transformed.sort((a, b) =>
    a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
  );
  transformed.push({key: '-1', value: t('Dropdown.Autre')});
  


  const defaultOption = (): {key: string; value: string} | undefined => {
    if (current.key.length > 0) {
      return {key: current.key, value: current.value};
    }
    return undefined;
  };

  const handleEvent = (name: string) => {
    setSelectAutre(false);
    setEventName(name);
    if (name === '-1') {
      setSelectAutre(true);
      setEventName('');
    }
  };

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
    input: {
      width: '100%', // Prend toute la largeur du conteneur
      marginBottom: 15,
      //height: 50,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      paddingHorizontal: 10,
    },
    inputError: {
      borderColor: 'red',
      borderWidth: 1,
    },
  });

  return (
    <View style={defaultStyles.sectionStyle}>
      <SelectList
        boxStyles={styles.container}
        setSelected={(val: string) => handleEvent(val)}
        data={transformed}
        search={true}
        save="key"
        placeholder={t('Dropdown.Event')}
        defaultOption={defaultOption()}
        dropdownTextStyles={{fontWeight: '600'}}
        inputStyles={{fontWeight: '600'}}
      />
      {selectAutre && (
        <PaperTextInput
          label={t('AddEvent.Name')}
          returnKeyType="done"
          value={eventName}
          onChangeText={text => setEventName(text)}
          autoCapitalize="none"
          style={error ? [styles.input, styles.inputError] : styles.input }
        />
        
      )}
      {error && <Text style={defaultStyles.error}>{error}</Text>}
    </View>
  );
};
