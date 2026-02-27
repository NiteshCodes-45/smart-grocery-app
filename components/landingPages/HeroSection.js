import { useState, useRef } from "react";
import { useAuth } from "../../store/auth-context";
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  TextInput,
  View,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNotification } from "../../notifications/NotificationProvider";

function HeroSection() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { loginUser } = useAuth();
  const notify = useNotification();

  function showPasswordToggle(type) {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    }
  }

  async function handleLogin() {
    const isLoginSuccess = await loginUser({
      email: loginEmail,
      password: loginPassword,
    });
    if (!isLoginSuccess.success) {
      notify.error(isLoginSuccess.message);
    }
    if (isLoginSuccess.success) {
      notify.success("Login Successful");
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.hero}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Smart Grocery</Text>
        <Text style={styles.tagline}>Organize. Track. Understand.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChangeText={setLoginEmail}
            style={styles.input}
          />
        </View>
        <View style={[styles.inputPasswordWrapper, styles.inputWrapper]}>
          <TextInput
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChangeText={setLoginPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          {showPassword ? (
            <Ionicons
              name="eye-off"
              size={20}
              color="#888"
              style={styles.eyeIcon}
              onPress={() => showPasswordToggle("password")}
            />
          ) : (
            <Ionicons
              name="eye"
              size={20}
              color="#888"
              style={styles.eyeIcon}
              onPress={() => showPasswordToggle("password")}
            />
          )}
        </View>

        <Pressable style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryBtnText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8F3DC",
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  /* HERO */
  hero: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 25,
    alignItems: "center",
  },

  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1B4332", // dark green text
    marginTop: 8,
  },

  tagline: {
    fontSize: 14,
    color: "#2F6F4E", // logo green reused
    marginVertical: 8,
  },

  heroText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: "#8ba183ff",
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 12,
    elevation: 2, // Android shadow
    width: "100%",
  },
  /* LOGO */
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },

  /* LOGIN */
  loginTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 25,
  },

  inputWrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 12,
  },

  input: {
    padding: 12,
    fontSize: 16,
    color: "#1B4332", // dark green for readability
  },

  backText: {
    marginTop: 20,
    marginBottom: 10,
    color: "#2F6F4E",
    fontSize: 14,
  },

  /* BUTTON */
  primaryBtn: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  orText: {
    fontSize: 18,
    padding: 12,
    fontWeight: "600",
    color: "#444",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  inputPasswordWrapper: {
    position: "relative",
    width: "100%",
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "55%",
    transform: [{ translateY: -12 }],
  },
});

export default HeroSection;
