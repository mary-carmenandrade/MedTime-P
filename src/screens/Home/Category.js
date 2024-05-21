import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config'; // Asegúrate de tener la configuración correcta de Firebase
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment';
import color from "../../constant/color";

initializeApp(firebaseConfig);
const db = getFirestore();

const Category = () => {
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
            <ScrollView contentContainerStyle={styles.header}>
                {/* Mostrar citas filtradas */}
                {filteredAppointments.map((appointment) => (
                    <View key={appointment.id} style={[styles.appointmentCard, appointment.estado === 'realizado' && styles.completedCard]}>
                        {/* Contenido de cada cita */}
                        <Text style={styles.label}>Paciente: <Text style={styles.value}>{appointment.nombre}</Text></Text>
                        <Text style={styles.label}>Motivo: <Text style={styles.value}>{appointment.motivo}</Text></Text>
                        <Text style={styles.label}>Hora programada para la cita: <Text style={styles.value}>{appointment.hora}</Text></Text>
                        <Text style={styles.label}>Número telefónico: <Text style={styles.value}>{appointment.telefono}</Text></Text>
                        <Text style={styles.label}>Correo: <Text style={styles.value}>{appointment.correo}</Text></Text>
                        <Text style={styles.label}>Dirección: <Text style={styles.value}>{appointment.direccion}</Text></Text>
                        <Text style={styles.label}>Estado: <Text style={styles.value}>{appointment.estado}</Text></Text>
                        <Text style={styles.label}>Fecha de Creación: <Text style={styles.value}>{appointment.fechaCreacion}</Text></Text>
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
                    <Ionicons name="add" size={24} color={color.white} />
                    <Text style={styles.addButtonText}>Añadir Nueva Cita</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: color.primaryColor,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: color.white,
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: color.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: color.lightGray,
    },
    appointmentCard: {
        backgroundColor: color.white,
        borderRadius: 10,
        marginBottom: 20,
        padding: 20,
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
    editButton: {
        marginTop: 10,
        backgroundColor: color.primaryColor,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: color.white,
        fontSize: 16,
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

export default Category;
