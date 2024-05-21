import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { BlurView } from 'expo-blur';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase-config';

const uri = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg';
const profilePicture = 'https://cdn-icons-png.flaticon.com/512/6007/6007346.png';

export default function Login({ setIsAuthenticated, navigation }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = useState('');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleCreateAccount = () => {
        navigation.navigate("Registrarse"); // Redirige a la pantalla de registro
    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Signed in!');
            const user = userCredential.user;
            console.log(user);
            setIsAuthenticated(true);
            navigation.navigate("TabView");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            Alert.alert("Error", errorMessage);
        });
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
            <View style={{width:100, height:100, backgroundColor:'purple', position:'absolute'}}></View>
            <View style={{width:100, height:100, backgroundColor:'blue', top:120, position:'absolute', transform:[{rotate:'25deg'}] }}></View>
            <View style={{width:100, height:100, backgroundColor:'red', bottom:120, position:'absolute', borderRadius:50, transform:[{rotate:'25deg'}] }}></View>
            <ScrollView contentContainerStyle={{
                flex: 1,
                width: '100%',
                height: '100%',
                alignContent: "center",
                justifyContent: "center",
            }}>
                <BlurView intensity={100} style={styles.blurView}>
                    <View style={styles.login}>
                        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '400', color: 'white' }}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="betomoedano@outlook.com"
                                placeholderTextColor="black"
                                value={email}
                                onChangeText={text => setEmail(text)}
                            />
                        </View>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: '400', color: 'white' }}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="password"
                                placeholderTextColor="black"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={text => setPassword(text)}
                            />
                        </View>
                        <TouchableOpacity onPress={handleSignIn} style={[styles.button, { backgroundColor: '#00CFEB90' }]}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '400' }}>Logearse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCreateAccount} style={[styles.button, { backgroundColor: '#6792FO90' }]}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '400' }}>Crear cuenta</Text>
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
        height: 500,
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
        color: 'white',
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
});
