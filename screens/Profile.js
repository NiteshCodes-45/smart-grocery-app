import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import Buttons from "../components/Buttons";
import { useGrocery } from "../store/grocery-context";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

function Profile({navigation}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const {addUser, users, currentUser, logoutUser} = useGrocery();

    console.log('Users:', users);

    useEffect(() => {
        const isUerLogin = users.find((user) => user.email === currentUser.email);
        if(isUerLogin){
            setName(isUerLogin.name);
            setEmail(isUerLogin.email);
            setLocation(isUerLogin.location);
        }
    }, [currentUser, users])

    function saveProfileHandler(){
        if (name.trim().length === 0) {
            Alert.alert("Invalid Input", "Please enter name.");
            return;
        }
        addUser({name, email, location});
        Alert.alert("Success", "Profile saved", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
        setName('');
        setEmail('');
        setLocation('');
    }

    function logoutProfileHandler(){
      logoutUser();
    }

  return (
    <>
      <Section>
        <InputRow label="Name" value={name} onChangeText={setName} keyboardType="text" />
        <InputRow label="Email" value={email} onChangeText={setEmail} keyboardType="email" />
        <InputRow
          label="Location"
          value={location}
          onChangeText={setLocation}
          keyboardType="text"
        />
        <Buttons pressBtn={saveProfileHandler} color="#5e0acc">
            Save
        </Buttons>
      </Section>
      <View style={styles.logoutContainer}>
        <Buttons pressBtn={logoutProfileHandler} btnColor="#b36072a8">
          LOGOUT
        </Buttons>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  logoutContainer:{
    marginHorizontal:25,
    marginTop:25,
  }
});

export default Profile;
