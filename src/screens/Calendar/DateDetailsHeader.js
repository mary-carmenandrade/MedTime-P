import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import color from "../../constant/color";
import { Ionicons } from "@expo/vector-icons";

const DateDetailsHeader = ({ onBackPress }) => {
    return (
        <View style={styles.header}>
            <View>
                <TouchableOpacity
                    onPress={onBackPress}
                    style={styles.button}
                >
                    <Ionicons name="arrow-back" size={24} color={color.white} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Date Details</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 60 : 20,
        paddingHorizontal: 20,
        backgroundColor: color.primaryColor,
    },
    button: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: color.white,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: color.white,
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
});

export default DateDetailsHeader;
