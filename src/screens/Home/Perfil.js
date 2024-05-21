import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getAuth, updateEmail, updatePassword, signOut } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseConfig } from './firebase-config';
import color from "../../constant/color";
import DateDetailsHeader from './DateDetailsHeader';


initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

export default function Perfil({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(db, "Medicos", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        setNombre(data.nombre);
                        setEmail(data.email);
                        setEspecialidad(data.especialidad);
                        setNumeroCelular(data.numeroCelular);
                        setProfileImage(data.photoURL);
                    } else {
                        console.log("No such document!");
                    }
                } catch (e) {
                    console.error("Error fetching user data: ", e);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleChooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        try {
            // Update email
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            // Update password if provided
            if (password) {
                await updatePassword(user, password);
            }

            let profileImageUrl = userData.photoURL;
            if (profileImage && profileImage !== userData.photoURL) {
                const response = await fetch(profileImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `profileImages/${user.uid}`);
                await uploadBytes(storageRef, blob);
                profileImageUrl = await getDownloadURL(storageRef);
            }

            const updatedData = {
                nombre,
                email,
                especialidad,
                numeroCelular,
                photoURL: profileImageUrl,
            };

            await updateDoc(doc(db, "Medicos", user.uid), updatedData);

            setUserData(updatedData); // Update local state with new data
            Alert.alert("Éxito", "Tus datos han sido actualizados");
            setIsEditing(false);
        } catch (e) {
            console.error("Error updating user data: ", e);
            Alert.alert("Error", "Hubo un problema al actualizar tus datos");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            if (navigation) {
                navigation.navigate("Login");
            } else {
                console.error("Error: 'navigation' object is undefined.");
            }
        } catch (e) {
            console.error("Error logging out: ", e);
            Alert.alert("Error", "Hubo un problema al cerrar sesión");
        }
    };
    

    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Icon name="log-out-outline" size={30} color={color.primaryColor} />
                </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={handleChooseImage}>
                    <Image source={{ uri: profileImage || 'https://cdn-icons-png.flaticon.com/512/6007/6007346.png' }} style={styles.profilePicture} />
                </TouchableOpacity>
                {isEditing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            placeholderTextColor="#888"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña (dejar en blanco para no cambiar)"
                            placeholderTextColor="#888"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Especialidad"
                            placeholderTextColor="#888"
                            value={especialidad}
                            onChangeText={setEspecialidad}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Número de Celular"
                            placeholderTextColor="#888"
                            value={numeroCelular}
                            onChangeText={setNumeroCelular}
                        />
                        <TouchableOpacity onPress={handleSaveChanges} style={styles.button}>
                            <Text style={styles.buttonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.name}>{userData.nombre}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>E-mail:</Text>
                            <Text style={styles.value}>{userData.email}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Especialidad:</Text>
                            <Text style={styles.value}>{userData.especialidad}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Número de Celular:</Text>
                            <Text style={styles.value}>{userData.numeroCelular}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.button}>
                            <Text style={styles.buttonText}>Editar Perfil</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color.lightGray,
        padding: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
    logoutButton: {
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        fontSize: 18,
        color: "#888",
    },
    profileContainer: {
        backgroundColor: color.white,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: color.primaryColor,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    value: {
        fontSize: 16,
        color: "#333",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        color: 'black',
    },
    button: {
        width: "100%",
        height: 50,
        borderRadius: 10,
        backgroundColor: color.primaryColor,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: color.white,
        fontSize: 18,
        fontWeight: '600',
    },
});
