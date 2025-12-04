// screens/LoginScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const handleLoginAsGuest = () => {
    navigation.navigate("Main");
  };

  const handleTermsPress = () => {
    Linking.openURL("https://example.com/terms");
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://example.com/privacy");
  };

  return (
    <View style={styles.container}>
      {/* Logo YouTube Learn */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* App icon */}
      <View style={styles.iconWrapper}>
        <Image
          source={require("../../assets/app-icon.png")}
          style={styles.appIcon}
          resizeMode="contain"
        />
      </View>

      {/* Tekst powitalny */}
      <View style={styles.textBlock}>
        <Text style={styles.welcome}>Welcome to the best</Text>
        <Text style={styles.welcome}>YouTube-based learning</Text>
        <Text style={styles.welcome}>application.</Text>
      </View>

      {/* Przycisk Log in as guest */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLoginAsGuest}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Log in as guest</Text>
      </TouchableOpacity>

      {/* Polityka prywatności / Terms */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>By continuing you agree with</Text>
        <View style={styles.footerLinksRow}>
          <TouchableOpacity onPress={handleTermsPress}>
            <Text style={styles.linkText}>Terms and Conditions</Text>
          </TouchableOpacity>
          <Text style={styles.footerSeparator}> and </Text>
          <TouchableOpacity onPress={handlePrivacyPress}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BACKGROUND = "#8D99AE";
const CARD_DARK = "#2B2D42";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "flex-start",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 132,
  },
  logo: {
    width: 292,
    height: 116,
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 132,
  },
  appIcon: {
    width: 128,
    height: 128,
  },
  textBlock: {
    marginBottom: 32,
  },
  welcome: {
    color: WHITE,
    fontSize: 22,
    lineHeight: 24,
    fontFamily: "Poppins-SemiBold",
  },
  button: {
    backgroundColor: CARD_DARK,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    color: WHITE,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  footerLinksRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  footerSeparator: {
    color: WHITE,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },
  linkText: {
    color: CARD_DARK,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textDecorationLine: "underline",
  },
});
