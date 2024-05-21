import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../../screens/Home/firebase-config';
import DateDetailsHeader from './DateDetailsHeader';
import { Ionicons } from "@expo/vector-icons";
import color from "../../constant/color";

initializeApp(firebaseConfig);
const db = getFirestore();

const DateDetailsScreen = () => {
    const route = useRoute();
    const { date } = route.params;
    const [appointments, setAppointments] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAppointments = async () => {
            const q = query(collection(db, 'Citas'), where('date', '==', date));
            const querySnapshot = await getDocs(q);
            const fetchedAppointments = [];
            querySnapshot.forEach((doc) => {
                fetchedAppointments.push({ id: doc.id, ...doc.data() });
            });
            setAppointments(fetchedAppointments);
        };
        fetchAppointments();
    }, [date]);

    const handleDelete = async (id) => {
        Alert.alert(
            "Eliminar Cita",
            "¿Estás seguro de que quieres eliminar esta cita?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        await deleteDoc(doc(db, 'Citas', id));
                        setAppointments(appointments.filter((appointment) => appointment.id !== id));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleComplete = async (id) => {
        await updateDoc(doc(db, 'Citas', id), { estado: 'realizado' });
        setAppointments(appointments.map((appointment) => 
            appointment.id === id ? { ...appointment, estado: 'realizado' } : appointment
        ));
    };

    return (
        <View style={{ flex: 1 }}>
            <DateDetailsHeader onBackPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Citas para {date}</Text>
                {appointments.map((appointment) => (
                    <View 
                        key={appointment.id} 
                        style={[styles.appointmentCard, appointment.estado === 'realizado' && styles.completedCard]}
                    >
                        <Text style={styles.label}>Paciente: <Text style={styles.value}>{appointment.nombre}</Text></Text>
                        <Text style={styles.label}>Motivo: <Text style={styles.value}>{appointment.motivo}</Text></Text>
                        <Text style={styles.label}>Hora programada para la cita: <Text style={styles.value}>{appointment.hora}</Text></Text>
                        <Text style={styles.label}>Número telefónico: <Text style={styles.value}>{appointment.telefono}</Text></Text>
                        <Text style={styles.label}>Correo: <Text style={styles.value}>{appointment.correo}</Text></Text>
                        <Text style={styles.label}>Dirección: <Text style={styles.value}>{appointment.direccion}</Text></Text>
                        <Text style={styles.label}>Estado: <Text style={styles.value}>{appointment.estado}</Text></Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.button} 
                                onPress={() => navigation.navigate('EditAppointment', { appointment })}
                            >
                                <Text style={styles.buttonText}>Editar Cita</Text>
                            </TouchableOpacity>
                            {appointment.estado !== 'realizado' && (
                                <TouchableOpacity 
                                    style={styles.button} 
                                    onPress={() => handleComplete(appointment.id)}
                                >
                                    <Text style={styles.buttonText}>Marcar como Realizada</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity 
                                style={[styles.button, styles.deleteButton]} 
                                onPress={() => handleDelete(appointment.id)}
                            >
                                <Text style={styles.buttonText}>Eliminar Cita</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => navigation.navigate('NewAppointment', { date })}
                >
                    <Ionicons name="add" size={24} color={color.white} />
                    <Text style={styles.addButtonText}>Añadir Nueva Cita</Text>
                </TouchableOpacity>
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
        textAlign: 'center',
    },
    appointmentCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    completedCard: {
        backgroundColor: '#d4edda',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontWeight: 'normal',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: color.primaryColor,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.primaryColor,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    addButtonText: {
        color: color.white,
        fontSize: 18,
        marginLeft: 10,
    },
});

export default DateDetailsScreen;
