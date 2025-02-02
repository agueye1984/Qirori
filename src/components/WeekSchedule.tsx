import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ScheduleState } from '../contexts/types';
import { theme } from '../core/theme';
import { WeekendList } from './WeekendList';


interface Props {
  initialSchedule: ScheduleState ;
  onScheduleChange: (schedule: ScheduleState) => void;
}

const WeekSchedule = ({ initialSchedule, onScheduleChange }: Props) => {
  const {t} = useTranslation();
  const daysOfWeek = WeekendList(t);

  const [schedule, setSchedule] = useState<ScheduleState>(initialSchedule);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [openPicker, setOpenPicker] = useState<{ day: string | null; type: 'startTime' | 'endTime' | null }>({ day: null, type: null });

  useEffect(() => {
    setSchedule(initialSchedule);
  }, [initialSchedule]);

  useEffect(() => {
    onScheduleChange(schedule);
  }, [schedule]);

  const handleDateChange = (day: string, type: 'startTime' | 'endTime', date: Date) => {
    const formattedTime = date.toTimeString().slice(0, 5);
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [type]: formattedTime
      }
    };

    if (day === daysOfWeek[0].id) {
      daysOfWeek.slice(1).forEach(otherDay => {
        updatedSchedule[otherDay.id][type] = formattedTime;
      });
    }
    onScheduleChange(updatedSchedule);
    setSchedule(updatedSchedule);
    setOpenPicker({ day: null, type: null });
  };

  const handleCapacityChange = (day: string, capacity: string) => {
    const numericValue = capacity.replace(/[^0-9]/g, '');
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        capacity: numericValue
      }
    };

    if (day === daysOfWeek[0].id) {
      daysOfWeek.slice(1).forEach(otherDay => {
        updatedSchedule[otherDay.id].capacity = numericValue;
      });
    }

    setSchedule(updatedSchedule);
    onScheduleChange(updatedSchedule);
  };

  return (
    <ScrollView style={styles.container}>
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
      onConfirm={date => handleDateChange(openPicker.day!, openPicker.type!, date)}
      onCancel={() => setOpenPicker({ day: null, type: null })}
      confirmText={t('Global.Confirm')}
      cancelText={t('Global.Cancel')}
      title={t('Global.SelectTime')}
    />
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Pour empêcher le débordement horizontal
    alignItems: 'center',
    marginBottom: 10,
  },
  dayLabel: {
    width: '100%', // Largeur pleine pour s'adapter au contenu
    fontSize: 16,
    marginBottom: 5,
  },
  timeInput: {
    flex: 1, // Rend l'élément flexible
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginRight: 5,
    minWidth: 80, // Limite minimale
    backgroundColor: theme.colors.surface,
  },
  capacityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    minWidth: 80,
    backgroundColor: theme.colors.surface,
  },
});

export default WeekSchedule;