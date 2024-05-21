import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';

const CalendarScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (route.params?.selectedDate) {
      setSelectedDate(route.params.selectedDate);
    }
  }, [route.params?.selectedDate]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    navigation.navigate('DateDetails', { date: day.dateString });
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default CalendarScreen;
