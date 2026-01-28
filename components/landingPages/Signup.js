import { useState } from "react";
import { Pressable, StyleSheet, View, TextInput, Text, Alert } from "react-native";
import { useAuth } from "../../store/auth-context";
import InputRow from "../settings/InputRow";

function Signup() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  const { signupUser } = useAuth();

  function Input(props) {
      return (
        <View style={styles.inputWrapper}>
          <TextInput {...props} style={styles.input} />
        </View>
      );
    }

  async function handleSignup() {
    if (userName.trim().length === 0) {
      Alert.alert("Invalid Input", "Please enter name.");
      return;
    }
    const signupSuccess = await signupUser({
      name: userName,
      email: email,
      location: location,
    });
    if(signupSuccess.success){
      Alert.alert("Success", "User Register successfully!!");
    }
    if(!signupSuccess.success){
      Alert.alert("Error", signupSuccess.message);
    }    
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
        notEditable={true}
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
    justifyContent:"center",
    gap: 8,
    borderWidth:1,
    borderColor:"#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default Signup;
