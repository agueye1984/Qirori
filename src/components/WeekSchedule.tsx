import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const WeekSchedule = () => {
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(day => ({
      day,
      startTime: '',
      endTime: '',
      capacity: '',
    }))
  );

  const handleInputChange = (day:any, field:string, value:string) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(item =>
        item.day === day ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <ScrollView>
      {schedule.map(({ day, startTime, endTime, capacity }) => (
        <View key={day} style={styles.row}>
          <Text style={styles.label}>{day}</Text>
          <TextInput
            style={styles.input}
            placeholder="Début"
            value={startTime}
            onChangeText={text => handleInputChange(day, 'startTime', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Fin"
            value={endTime}
            onChangeText={text => handleInputChange(day, 'endTime', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Capacité"
            value={capacity}
            onChangeText={text => handleInputChange(day, 'capacity', text)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    width: 80, // Taille fixe pour chaque champ de saisie
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 5,
    paddingHorizontal: 5,
  },
});

export default WeekSchedule;
