import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../../screens/Home/firebase-config';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateDetailsHeader from './DateDetailsHeader';

initializeApp(firebaseConfig);
const db = getFirestore();

const EditAppointmentScreen = ({ route }) => {
    const { appointment } = route.params;
    const [nombre, setNombre] = useState(appointment.nombre);
    const [dni, setDni] = useState(appointment.dni);
    const [telefono, setTelefono] = useState(appointment.telefono);
    const [correo, setCorreo] = useState(appointment.correo);
    const [direccion, setDireccion] = useState(appointment.direccion);
    const [motivo, setMotivo] = useState(appointment.motivo);
    const [hora, setHora] = useState(new Date(appointment.hora));
    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigation = useNavigation();

    const handleSave = async () => {
        try {
            const docRef = doc(db, 'Citas', appointment.id);
            await updateDoc(docRef, {
                nombre,
                dni,
                telefono,
                correo,
                direccion,
                motivo,
                hora: hora.toTimeString().split(' ')[0], // Guardar solo la hora en formato HH:MM:SS
            });
            alert('Cita actualizada con éxito');
            navigation.navigate('DateDetails', { date: appointment.date });
        } catch (e) {
            console.error('Error updating document: ', e);
            alert('Error actualizando la cita');
        }
    };

    return (
        <View style={{ flex: 1 }}>
        <DateDetailsHeader onBackPress={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Cita para {appointment.date}</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
            />
            <TextInput
                style={styles.input}
                value={dni}
                onChangeText={setDni}
                placeholder="DNI"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Teléfono"
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="Correo Electrónico"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                value={direccion}
                onChangeText={setDireccion}
                placeholder="Dirección"
            />
            <TextInput
                style={styles.input}
                value={motivo}
                onChangeText={setMotivo}
                placeholder="Motivo de Consulta"
            />
            <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
                <DateTimePicker
                    value={hora}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowTimePicker(false);
                        if (selectedDate) {
                            setHora(selectedDate);
                        }
                    }}
                />
            )}
            <Button title="Guardar Cita" onPress={handleSave} />
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default EditAppointmentScreen;
