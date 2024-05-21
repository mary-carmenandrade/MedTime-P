import React, { useState } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Foundation } from "@expo/vector-icons";
import color from "../constant/color";
import Home from "./Home/Home";
import CalendarScreen from "./Calendar/CalendarScreen";
import Perfil from "./Home/Perfil"; // Importa la pantalla de perfil


const TabView = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const TabButton = ({ icon, label, tabName }) => {
    const [pressed, setPressed] = useState(false);

    const togglePress = () => {
      setPressed(!pressed);
      handleTabChange(tabName);
    };

    return (
      <TouchableOpacity onPress={togglePress}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            backgroundColor:
              activeTab === tabName ? color.primaryLight : "transparent",
            paddingVertical: 9,
            paddingHorizontal: 14,
            borderRadius: 30,
          }}
        >
          <View>{icon}</View>
          {pressed && (
            <Text
              style={{
                fontSize: 12,
                color:
                  activeTab === tabName
                    ? color.primaryColor
                    : color.black,
              }}
            >
              {label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <StatusBar barStyle={"dark-content"} backgroundColor={color.white} />
      {activeTab === "Home" && <Home />}
      {activeTab === "CalendarScreen" && <CalendarScreen />}
      {activeTab === "Messages" && <Home />}
      {activeTab === "Notifications" && <Home />}
      {activeTab === "Perfil" && <Perfil />}

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View style={styles.wrapper}>
          <TabButton
            icon={<Foundation name="home" size={24} color={color.primaryColor} />}
            label="Home"
            tabName="Home"
          />
          <TabButton
            icon={<Image source={require("../asset/icon/calendar.png")} style={{ width: 25, height: 25 }} />}
            label="CalendarScreen"
            tabName="CalendarScreen"
          />

          <TabButton
            icon={<Image source={require("../asset/icon/user.png")} style={{ width: 25, height: 25 }} />}
            label="Perfil"
            tabName="Perfil"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TabView;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 4,
    height: Platform.OS === "ios" ? 80 : 70,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 17 : 5,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 1,
  },
});
