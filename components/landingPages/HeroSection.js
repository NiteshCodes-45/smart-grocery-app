import { useState, useRef } from "react";
import { useAuth } from "../../store/auth-context";
import { Text, StyleSheet, Pressable, Animated, TextInput, View, Alert, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Signup from "./Signup";

function HeroSection() {
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginRegister, setShowLoginRegister] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { loginUser } = useAuth();

  function Input(props) {
    return (
      <View style={styles.inputWrapper}>
        <TextInput {...props} style={styles.input} />
      </View>
    );
  }

  function toggleHero(type) {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowLogin((prev) => !prev);
      setShowLoginRegister(type);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  async function handleLogin() {
    const isLoginSuccess = await loginUser({
      email: loginEmail,
      password: loginPassword,
    });
    if(!isLoginSuccess.success) { Alert.alert("Error", isLoginSuccess.message); }
    if(isLoginSuccess.success) { Alert.alert("Success", "Login Successful"); }
  }

  return (
    <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
      <View style={styles.hero}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Smart Grocery</Text>
        <Text style={styles.tagline}>
          Shop smarter. Track better.
        </Text>
      </View>
      {!showLogin ? (
        <>
          <Text style={styles.heroText}>
            Manage groceries smarter, reduce waste, and save money — all in one
            place.
          </Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => toggleHero("login")}
          >
            <Ionicons name="log-in-outline" size={20} color="#2F6F4E" />
            <Text style={styles.primaryBtnText}>Login with Email</Text>
          </Pressable>

          <Text style={styles.orText}>OR</Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => toggleHero("signup")}
          >
            <Ionicons name="create-outline" size={20} color="#2F6F4E" />
            <Text style={styles.primaryBtnText}>Register</Text>
          </Pressable>
        </>
      ) : (
        <>
          {/* LOGIN HERO */}
          {showLoginRegister === "login" && (
            <>
              <Text style={styles.loginTitle}>Login</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Email"
                  type="email"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Password"
                  type="password"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={true}
                  style={styles.input}
                />
              </View>

              <Pressable style={styles.primaryBtn} onPress={handleLogin}>
                <Text style={styles.primaryBtnText}>Continue</Text>
              </Pressable>
            </>
          )}
          {showLoginRegister === "signup" && (
            <>
            {/* Register */}
              <Text style={styles.loginTitle}>Signup</Text>
              <Signup />
            </>
          )}

          <Pressable onPress={toggleHero}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  /* HERO */
  hero: {
    backgroundColor: "#D8F3DC",
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 30,
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

  /* LOGO */
  logo: {
    width: 90,
    height: 90,
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
    marginTop: 14,
    color: "#2F6F4E",
    fontSize: 14,
  },

  /* BUTTON */
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F6F4E", // matches logo bag
  },

  orText: {
    fontSize: 18,
    padding: 12,
    fontWeight: "600",
    color: "#444",
  },

  /* (Optional – if reused elsewhere) */
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
});

export default HeroSection;
