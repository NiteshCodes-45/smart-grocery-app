import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "../../store/auth-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputRow from "../settings/InputRow";
import { useNotification } from "../../notifications/NotificationProvider";
import { validateEmail } from "../../data/Constant";

function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [location, setLocation] = useState("");
  const { signupUser } = useAuth();
  const notify = useNotification();

  function showPasswordToggle(type) {
    if (type === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  }

  function Input(props) {
    return (
      <View style={styles.inputWrapper}>
        <TextInput {...props} style={styles.input} />
      </View>
    );
  }

  async function handleSignup() {
    if (userName.trim().length === 0) {
      notify.error("Please enter name.");
      return;
    }
    if (email.trim().length === 0) {
      notify.error("Please enter email.");
      return;
    }
    if (!validateEmail(email)) {
      notify.error("Please enter a valid email.");
      return;
    }
    if (password.trim().length === 0) {
      notify.error("Please enter password.");
      return;
    }
    if (password !== confirmPassword) {
      notify.error("Passwords do not match.");
      return;
    }
    const signupSuccess = await signupUser({
      name: userName,
      email: email,
      password: password,
      location: location,
    });
    if (signupSuccess.success) {
      notify.success("User Register successfully!!");
    }
    if (!signupSuccess.success) {
      notify.error(signupSuccess.message);
    }
    setUserName("");
    setEmail("");
    setPassword("");
    setLocation("");
  }

  return (
    <ScrollView style={styles.scrollView}>
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
        <InputRow
          label="Name"
          value={userName}
          onChangeText={setUserName}
          keyboardType="text"
        />
        <InputRow
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email"
          notEditable={true}
        />
        <View style={styles.inputPasswordWrapper}>
          <InputRow
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            keyboardType="password"
            secureTextEntry={!showPassword}
            notEditable={true}
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
        <View style={styles.inputPasswordWrapper}>
          <InputRow
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            keyboardType="password"
            secureTextEntry={!showConfirmPassword}
            notEditable={true}
          />
          {showConfirmPassword ? (
            <Ionicons
              name="eye-off"
              size={20}
              color="#888"
              style={styles.eyeIcon}
              onPress={() => showPasswordToggle("confirmPassword")}
            />
          ) : (
            <Ionicons
              name="eye"
              size={20}
              color="#888"
              style={styles.eyeIcon}
              onPress={() => showPasswordToggle("confirmPassword")}
            />
          )}
        </View>
        <InputRow
          label="Location"
          value={location}
          onChangeText={setLocation}
          keyboardType="text"
        />
        <Pressable style={styles.primaryBtn} onPress={handleSignup}>
          <Text style={styles.primaryBtnText}>Register</Text>
        </Pressable>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#D8F3DC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B4332",
  },
  tagline: {
    fontSize: 14,
    color: "#2F6F4E",
    marginVertical: 8,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#8ba183ff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2, // Android shadow
    width: "100%",
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
  inputPasswordWrapper: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "60%",
    transform: [{ translateY: -12 }],
  },
});

export default Signup;
