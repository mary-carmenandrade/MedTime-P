import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MonthHeader = ({ date }) => {
  const monthName = date.toLocaleString('default', { month: 'long' });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('Go to previous month')}>
        <Text>{'<'}</Text>
      </TouchableOpacity>
      <Text>{monthName}</Text>
      <TouchableOpacity onPress={() => console.log('Go to next month')}>
        <Text>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default MonthHeader;
