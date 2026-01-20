import { useState, useRef } from "react";
import { useGrocery } from "../../store/grocery-context";
import { Text, StyleSheet, Pressable, Animated, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Signup from "./Signup";

function HeroSection() {
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginRegister, setShowLoginRegister] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { loginUser } = useGrocery();

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

  function handleLogin() {
    const isLoginSuccess = loginUser({
      email: loginEmail,
    });
  }

  return (
    <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
      <Ionicons name="basket-outline" size={64} color="#FFFFFF" />
      <Text style={styles.appTitle}>Smart Grocery</Text>
      {!showLogin ? (
        <>
          {/* MARKETING HERO */}
          <Text style={styles.tagline}>Plan • Buy • Track</Text>

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
            <Ionicons name="log-in-outline" size={20} color="#2F6F4E" />
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
                {/* <Input placeholder="Password" secureTextEntry /> */}
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
        backgroundColor: "#2F6F4E",
        padding: 24,
        alignItems: "center",
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
        marginVertical: 16,
    },
    inputWrapper: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        marginBottom: 12,
    },
    input: {
        padding: 12,
        fontSize: 16,
    },
    backText: {
        marginTop: 12,
        color: "#D8F3DC",
    },

    appTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFFFFF",
        marginTop: 12,
    },
    tagline: {
        fontSize: 16,
        color: "#D8F3DC",
        marginBottom: 12,
    },
    heroText: {
        fontSize: 15,
        color: "#EAF5EF",
        textAlign: "center",
        marginBottom: 20,
    },
    /* BUTTON */
    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2F6F4E",
    },
    orText: {
      fontSize:20, 
      padding: 15, 
      fontWeight:"bold", 
      color:"white"
    }
});

export default HeroSection;
