import React, { useState } from "react";
import { View, TextInput, StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { BlurView } from 'expo-blur';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config';
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

const uri = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export default function Registrarse({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const auth = getAuth(app);

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (imageUri) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileName = imageUri.split('/').pop();
        const storageRef = ref(storage, `profileImages/${fileName}`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    };

    const handleCreateAccount = async () => {
        // Verificar si las contraseñas coinciden
        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        setUploading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Account created!');
            const user = userCredential.user;
            console.log(user);

            // Subir la imagen de perfil a Firebase Storage
            let profileImageUrl = null;
            if (profileImage) {
                profileImageUrl = await uploadImage(profileImage);
            }

            // Guardar los datos adicionales en Firestore usando el UID del usuario
            await setDoc(doc(db, "Medicos", user.uid), {
                nombre: nombre,
                email: email,
                especialidad: especialidad,
                numeroCelular: numeroCelular,
                photoURL: profileImageUrl || null,
            });

            navigation.navigate("Login");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            Alert.alert("Error", errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
            <View style={{ width: 100, height: 100, backgroundColor: 'purple', position: 'absolute' }}></View>
            <View style={{ width: 100, height: 100, backgroundColor: 'blue', top: 120, position: 'absolute', transform: [{ rotate: '25deg' }] }}></View>
            <View style={{ width: 100, height: 100, backgroundColor: 'red', bottom: 120, position: 'absolute', borderRadius: 50, transform: [{ rotate: '25deg' }] }}></View>
            <ScrollView contentContainerStyle={{
                flex: 1,
                width: '100%',
                height: '100%',
                alignContent: "center",
                justifyContent: "center",
            }}>
                <BlurView intensity={100} style={styles.blurView}>
                    <View style={styles.login}>
                        <View>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del doctor"
                                placeholderTextColor="black"
                                value={nombre}
                                onChangeText={text => setNombre(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="betomoedano@outlook.com"
                                placeholderTextColor="black"
                                value={email}
                                onChangeText={text => setEmail(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="black"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={text => setPassword(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Confirmar Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="black"
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={text => setConfirmPassword(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Especialidad</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Especialidad del doctor"
                                placeholderTextColor="black"
                                value={especialidad}
                                onChangeText={text => setEspecialidad(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Número de Celular</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Número de celular"
                                placeholderTextColor="black"
                                value={numeroCelular}
                                onChangeText={text => setNumeroCelular(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Imagen</Text>
                            <TouchableOpacity onPress={pickImage} style={styles.selectButton}>
                                <Text style={styles.buttonText}>Seleccionar imagen</Text>
                            </TouchableOpacity>
                        </View>
                        {uploading && <Text>Subiendo imagen...</Text>}
                        {profileImage && <Text>Imagen seleccionada: {profileImage.split('/').pop()}</Text>}
                        <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
                            <Text style={styles.buttonText}>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    blurView: {
        padding: 20,
        borderRadius: 10,
    },
    login: {
        width: 350,
        height: 600,
        borderColor: "white",
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        alignItems: "center"
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#fff",
        marginVertical: 30,
    },
    label: {
        fontSize: 17,
        fontWeight: '400',
        color: 'white',
        marginBottom: 5,
    },
    input: {
        width: 250,
        height: 40,
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#ffffff90',
        marginBottom: 20,
        color: 'black',
    },
    button: {
        width: 250,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#00CFEB90",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        borderColor: '#fff',
        borderWidth: 1,
    },
    selectButton: {
        width: 250,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#00CFEB90",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        borderColor: '#fff',
        borderWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '400',
    },
});
