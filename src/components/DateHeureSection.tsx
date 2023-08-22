import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import TextInput from '../components/TextInput'
import DatePicker from 'react-native-date-picker'
import { CustomInputTextDate } from './CustomInputTextDate'

type Props = {
  dateDeb: Date
  heureDeb: Date
  dateF: Date
  heureF: Date
  setDateDeb: (value: Date) => void
  setHeureDeb: (value: Date) => void
  setDateF: (value: Date) => void
  setHeureF: (value: Date) => void
}

export const DateHeureSection = ({
  dateDeb,
  heureDeb,
  dateF,
  heureF,
  setDateDeb,
  setHeureDeb,
  setDateF,
  setHeureF,
}: Props) => {
  const { t } = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const [dateDebut, setDateDebut] = useState<Date>(dateDeb);
  const [heureDebut, setHeureDebut] = useState<Date>(heureDeb);
  const [dateFin, setDateFin] = useState<Date>(dateF);
  const [heureFin, setHeureFin] = useState<Date>(heureF);
  const [openDateDebut, setOpenDateDebut] = useState(false)
  const [openHeureDebut, setOpenHeureDebut] = useState(false)
  const [openDateFin, setOpenDateFin] = useState(false)
  const [openHeureFin, setOpenHeureFin] = useState(false)

  let dateFormatDebut = dateDebut.toLocaleDateString('en', { year: "numeric", day: "2-digit", month: "short", });
  let heureFormatDebut = heureDebut.toLocaleTimeString('en', { hour: "numeric", minute: "numeric", });
  let dateFormatFin = dateFin.toLocaleDateString('en', { year: "numeric", day: "2-digit", month: "short", });
  let heureFormatFin = heureFin.toLocaleTimeString('en', { hour: "numeric", minute: "numeric", });

  const handleOpenDateDebutChange = () => {
    setOpenDateDebut(true);
  }

  const handleOpenHeureDebutChange = () => {
    setOpenHeureDebut(true);
  }

  const handleOpenDateFinChange = () => {
    setOpenDateFin(true);
  }

  const handleOpenHeureFinChange = () => {
    setOpenHeureFin(true);
  }

  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  })

  return (
    <View>
      <Text style={styles.detailsTitle}>{t('AddEvent.DateHeure')}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginVertical: 25 }}>
          <Text style={styles.detailsTitle}>{t('AddEvent.DateDebut')}</Text>
        </View>
        <View style={{ marginHorizontal: 25 }}>

          <TextInput
            returnKeyType="next"
            value={dateFormatDebut}
            onChangeText={handleOpenDateDebutChange}
            autoCapitalize="none"
            onFocus={handleOpenDateDebutChange}
          onPressIn={handleOpenDateDebutChange}
          />

          <DatePicker
            modal
            open={openDateDebut}
            mode='date'
            date={dateDebut}
            onDateChange={(text) => {
              setDateDebut(text)
              setDateDeb(text)
            }}
            onConfirm={(date) => {
              setOpenDateDebut(false)
              setDateDebut(date)
              setDateDeb(date)
            }}
            onCancel={() => {
              setOpenDateDebut(false)
            }}
          />
        </View>
        <View style={{ marginLeft: 20 }}>
          
          <TextInput
            returnKeyType="next"
            value={heureFormatDebut}
            onChangeText={handleOpenHeureDebutChange}
            autoCapitalize="none"
            onFocus={handleOpenHeureDebutChange}
          onPressIn={handleOpenHeureDebutChange}
          />
          <DatePicker
            modal
            open={openHeureDebut}
            mode='time'
            date={heureDebut}
            onDateChange={(text) => {
              setHeureDebut(text)
              setHeureDeb(text)
            }}
            onConfirm={(date) => {
              setOpenHeureDebut(false)
              setHeureDebut(date)
              setHeureDeb(date)
            }}
            onCancel={() => {
              setOpenHeureDebut(false)
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginVertical: 25 }}>
          <Text style={styles.detailsTitle}>{t('AddEvent.DateFin')}</Text>
        </View>
        <View style={{ marginHorizontal: 35 }}>
          
          <TextInput
            returnKeyType="next"
            value={dateFormatFin}
            onChangeText={handleOpenDateFinChange}
            autoCapitalize="none"
            onFocus={handleOpenDateFinChange}
          onPressIn={handleOpenDateFinChange}
          />
          <DatePicker
            modal
            open={openDateFin}
            mode='date'
            date={dateFin}
            onDateChange={(text) => {
              setDateFin(text)
              setDateF(text)
            }}
            onConfirm={(date) => {
              setOpenDateFin(false)
              setDateFin(date)
              setDateF(date)
            }}
            onCancel={() => {
              setOpenDateFin(false)
            }}
          />
        </View>
        <View style={{ marginHorizontal: 15 }}>
          
          <TextInput
            returnKeyType="next"
            value={heureFormatFin}
            onChangeText={handleOpenHeureFinChange}
            autoCapitalize="none"
            onFocus={handleOpenHeureFinChange}
          onPressIn={handleOpenHeureFinChange}
          />
          <DatePicker
            modal
            open={openHeureFin}
            mode='time'
            date={heureFin}
            onDateChange={(text) => {
              setHeureFin(text)
              setHeureF(text)
            }}
            onConfirm={(date) => {
              setOpenHeureFin(false)
              setHeureFin(date)
              setHeureF(date)
            }}
            onCancel={() => {
              setOpenHeureFin(false)
            }}
          />
        </View>
      </View>
    </View>
  )
}
