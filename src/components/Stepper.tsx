import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface StepperProps {
  value: number; // Le type est `number` car `value` représente un nombre
  onIncrement: () => void; // Fonction déclenchée lorsqu'on incrémente
  onDecrement: () => void; // Fonction déclenchée lorsqu'on décrémente
  onChange: (text: string) => void; // Fonction appelée lors d'une modification manuelle
}

const Stepper: React.FC<StepperProps> = ({ value, onIncrement, onDecrement, onChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrement} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        value={value.toString()} // Convertir le nombre en chaîne
        onChangeText={onChange}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity onPress={onIncrement} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E37627',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    textAlign: 'center',
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
});

export default Stepper;
