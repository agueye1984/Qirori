import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

type DaySchedule = {
  startTime: Date;
  endTime: Date;
  capacity: string;
};

type ScheduleState = {
  [key: string]: DaySchedule;
};

const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
];

const WeekSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleState>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = {
        startTime: new Date(),
        endTime: new Date(),
        capacity: ''
      };
      return acc;
    }, {} as ScheduleState)
  );


  const [openPicker, setOpenPicker] = useState<{ day: string | null; type: 'startTime' | 'endTime' | null }>({ day: null, type: null });

  const handleDateChange = (day: string, type: 'startTime' | 'endTime', date: Date) => {
    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        [type]: date
      }
    }));
    setOpenPicker({ day: null, type: null });
  };

  const handleCapacityChange = (day: string, capacity: string) => {
    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        capacity
      }
    }));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {daysOfWeek.map(day => (
        <View key={day} style={styles.row}>
          <Text style={styles.dayLabel}>{day}</Text>
          <TextInput
            style={styles.timeInput}
            placeholder="Heure de début"
            value={new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' }).format(schedule[day].startTime)}
            onFocus={() => setOpenPicker({ day, type: 'startTime' })}
          />
          <TextInput
            style={styles.timeInput}
            placeholder="Heure de fin"
            value={new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' }).format(schedule[day].endTime)}
            onFocus={() => setOpenPicker({ day, type: 'endTime' })}
          />
          <TextInput
            style={styles.capacityInput}
            placeholder="Capacité"
            keyboardType="numeric"
            value={schedule[day].capacity}
            onChangeText={text => handleCapacityChange(day, text)}
          />
        </View>
      ))}
      <DatePicker
        modal
        open={openPicker.day !== null}
        date={openPicker.day ? schedule[openPicker.day][openPicker.type!] : new Date()}
        mode="time"
        onConfirm={(date) => handleDateChange(openPicker.day!, openPicker.type!, date)}
        onCancel={() => setOpenPicker({ day: null, type: null })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayLabel: {
    // Supprimez la largeur fixe
     width: 100,
    marginRight: 10, // Ajoutez une marge pour l'espace entre le label et les champs de saisie
    fontSize: 16, // Taille de police ajustable en fonction de vos besoins
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
   // flex: 1,
    marginRight: 5,
    width: 80,
  },
  capacityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 80,
  },
});

export default WeekSchedule;
