import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config'; // Asegúrate de tener la configuración correcta de Firebase
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment';

initializeApp(firebaseConfig);
const db = getFirestore();

const Home = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const today = moment().format('YYYY-MM-DD');

    useEffect(() => {
        const fetchAppointments = async () => {
            const q = query(collection(db, 'Citas'), where('date', '==', today));
            const querySnapshot = await getDocs(q);
            const fetchedAppointments = [];
            querySnapshot.forEach((doc) => {
                fetchedAppointments.push({ id: doc.id, ...doc.data() });
            });
            setAppointments(fetchedAppointments);
        };
        fetchAppointments();
    }, [today]);

    // Función para filtrar citas según el nombre del paciente
    const filteredAppointments = appointments.filter(appointment =>
        appointment.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={{ flex: 1 }}>
            {/* Header personalizado */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Citas para hoy ({today})</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre"
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Mostrar citas filtradas */}
                {filteredAppointments.map((appointment) => (
                    <View key={appointment.id} style={styles.appointmentCard}>
                        {/* Contenido de cada cita */}
                        <Text style={styles.label}>Paciente: <Text style={styles.value}>{appointment.nombre}</Text></Text>
                        <Text style={styles.label}>Motivo: <Text style={styles.value}>{appointment.motivo}</Text></Text>
                        <Text style={styles.label}>Hora programada para la cita: <Text style={styles.value}>{appointment.hora}</Text></Text>
                        <Text style={styles.label}>Número telefónico: <Text style={styles.value}>{appointment.telefono}</Text></Text>
                        <Text style={styles.label}>Correo: <Text style={styles.value}>{appointment.correo}</Text></Text>
                        <Text style={styles.label}>Dirección: <Text style={styles.value}>{appointment.direccion}</Text></Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditAppointment', { appointment })}
                        >
                            <Text style={styles.editButtonText}>Editar Cita</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {/* Botón para añadir nueva cita */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('NewAppointment', { date: today })}
                >
                    <Ionicons name="add" size={24} color="#ffffff" />
                    <Text style={styles.addButtonText}>Añadir Nueva Cita</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#7e57c2', // Color lila oscuro
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10,
    },
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontWeight: 'normal',
    },
    editButton: {
        marginTop: 10,
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 18,
        marginLeft: 10,
    },
});

export default Home;