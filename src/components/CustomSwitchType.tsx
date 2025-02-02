import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustomSwitchType = ({
  label,
  onValueChange,
}: {
  label: string;
  onValueChange: (value: boolean) => void;
}) => {
  
  const toggleSwitch = (value: boolean) => {
    const newValue = !value;
    onValueChange(newValue);
  };

  return (
    <View style={styles.container1}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.container, styles.containerDisabled]}
          onPress={()=> toggleSwitch(true)}>
          <View style={[styles.switchCircle, styles.disabledCircle]}>
            <Icon name="gift" size={20} color="#fff" />
            
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.container, styles.containerDisabled]}
          onPress={()=> toggleSwitch(false)}>
          <View style={[styles.switchCircle, styles.enabledCircle]}>
            <Icon name="hand-holding-usd" size={20} color="#fff" />
            
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    //width: 100,
    justifyContent: 'space-between',
  },
  containerEnabled: {
    backgroundColor: '#fff',
  },
  containerDisabled: {
    backgroundColor: '#fff',
  },
  switchCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabledCircle: {
    backgroundColor: '#33F3FF',
  },
  disabledCircle: {
    backgroundColor: '#FF9333',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textEnabled: {
    color: '#000',
  },
  textDisabled: {
    color: '#000',
  },
  labelContainer: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  status: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CustomSwitchType;
