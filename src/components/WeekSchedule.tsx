import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ScheduleState } from '../contexts/types';
import { WeekendList } from './WeekendList';

/* const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
]; */

interface Props {
  onScheduleChange: (schedule: ScheduleState) => void;
}

const WeekSchedule = ({ onScheduleChange }: Props) => {
  const {t} = useTranslation();
  const daysOfWeek = WeekendList(t);

  const [schedule, setSchedule] = useState<ScheduleState>(
    daysOfWeek.reduce((acc, day) => {
      acc[day.id] = {
        startTime: '00:00',
        endTime: '00:00',
        capacity: ''
      };
      return acc;
    }, {} as ScheduleState)
  );
  const [pickerDate, setPickerDate] = useState(new Date());
  const [openPicker, setOpenPicker] = useState<{ day: string | null; type: 'startTime' | 'endTime' | null }>({ day: null, type: null });

  useEffect(() => {
    onScheduleChange(schedule);
  }, [schedule]);

  const handleDateChange = (day: string, type: 'startTime' | 'endTime', date: Date) => {
    const formattedTime = date.toTimeString().substr(0, 5);
    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        [type]: formattedTime
      }
    }));
    setOpenPicker({ day: null, type: null });
    onScheduleChange(schedule);
  };

  const handleCapacityChange = (day: string, capacity: string) => {
    const numericValue = capacity.replace(/[^0-9]/g, '')
    console.log(numericValue)
    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        capacity: numericValue
      }
    }));
    onScheduleChange(schedule);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {daysOfWeek.map(day => (
        <View key={day.id} style={styles.row}>
          <Text style={styles.dayLabel}>{day.name}</Text>
          <TextInput
            style={styles.timeInput}
            placeholder={t('WeekSchedule.StartTime')}
            value={schedule[day.id].startTime}
            onFocus={() => {
              setOpenPicker({ day: day.id, type: 'startTime' });
              setPickerDate(new Date(`1970-01-01T${schedule[day.id].startTime}:00`));
            }}
          />
          <TextInput
            style={styles.timeInput}
            placeholder={t('WeekSchedule.EndTime')}
            value={schedule[day.id].endTime}
            onFocus={() => {
              setOpenPicker({ day: day.id, type: 'endTime' });
              setPickerDate(new Date(`1970-01-01T${schedule[day.id].endTime}:00`));
            }}
          />
          <TextInput
            style={styles.capacityInput}
            placeholder={t('WeekSchedule.Capacity')}
            keyboardType="numeric"
            value={schedule[day.id].capacity}
            onChangeText={text => handleCapacityChange(day.id, text)}
          />
        </View>
      ))}
       <DatePicker
        modal
        open={openPicker.day !== null}
        date={pickerDate}
        mode="time"
        onConfirm={(date) => handleDateChange(openPicker.day!, openPicker.type!, date)}
        onCancel={() => setOpenPicker({ day: null, type: null })}
        confirmText={t('Global.Confirm')}
        cancelText={t('Global.Cancel')}
        title={t('Global.SelectTime')}
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
    width: 100,
    marginRight: 10,
    fontSize: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
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