import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import Buttons from "../components/Buttons";
import { useGrocery } from "../store/grocery-context";
import { useTheme } from "../store/theme-context";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Profile() {
    const [userId, setUserId] = useState();
    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const {updateProfile, users, currentUser, logoutUser} = useGrocery();

    const navigation = useNavigation();
    const {theme} = useTheme();

    useEffect(() => {
        const isUerLogin = users.find((user) => user.email === currentUser.email);
        if(isUerLogin){
            setUserId(isUerLogin.id);
            setName(isUerLogin.name);
            setEmail(isUerLogin.email);
            setLocation(isUerLogin.location);
        }
    }, [currentUser, users])

    function saveProfileHandler() {
      if (name.trim().length === 0) {
        Alert.alert("Invalid Input", "Please enter name.");
        return;
      }

      updateProfile({
        name,
        email,
        location,
      });

      Alert.alert("Success", "Profile Updated", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }

    function logoutProfileHandler(){
      logoutUser();
    }

  return (
    <View style={[styles.profileContainer, {backgroundColor:theme.colors.background}]}>
      <Section>
        <InputRow
          label="Name"
          value={name}
          onChangeText={setName}
          keyboardType="text"
        />
        <InputRow
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email"
          notEditable={false}
        />
        <InputRow
          label="Location"
          value={location}
          onChangeText={setLocation}
          keyboardType="text"
        />
        <Buttons pressBtn={saveProfileHandler} color="#5e0acc">
          Update
        </Buttons>
      </Section>
      <View style={styles.logoutContainer}>
        <Buttons pressBtn={logoutProfileHandler} btnColor="#f80404a8">
          LOGOUT
        </Buttons>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer:{
    flex:1
  },
  logoutContainer:{
    marginHorizontal:18,
    marginTop:25,
  }
});

export default Profile;
