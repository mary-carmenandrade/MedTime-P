import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DayCell = ({ date, navigation }) => {
  const onDayPress = () => {
    navigation.navigate('DayView', { date });
  };

  return (
    <TouchableOpacity style={styles.day} onPress={onDayPress}>
      <Text style={styles.dayText}>{date.getDate()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  day: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
  },
  dayText: {
    fontSize: 14,
  },
});

export default DayCell;