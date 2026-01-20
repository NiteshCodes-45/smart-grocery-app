import { useState } from "react";
import { Pressable, StyleSheet, View, TextInput, Text, Alert } from "react-native";
import { useGrocery } from "../../store/grocery-context";
import { useNavigation } from "@react-navigation/native";
import InputRow from "../settings/InputRow";

function Signup() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  const { signupUser } = useGrocery();
  const navigation = useNavigation();

  function Input(props) {
      return (
        <View style={styles.inputWrapper}>
          <TextInput {...props} style={styles.input} />
        </View>
      );
    }

  function handleSignup() {
    if (userName.trim().length === 0) {
      Alert.alert("Invalid Input", "Please enter name.");
      return;
    }
    signupUser({
      name: userName,
      email: email,
      location: location,
    });
    Alert.alert("Success", "User Register successfully!!");
    setUserName("");
    setEmail("");
    setLocation("");
  }

  return (
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
      />
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
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
    justifyContent:"center",
    gap: 8,
    borderWidth:1,
    borderColor:"#4e6d5d",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F6F4E",
  },
});

export default Signup;
