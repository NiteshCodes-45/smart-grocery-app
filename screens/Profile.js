import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import Buttons from "../components/Buttons";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../store/auth-context";
import { useTheme } from "../store/theme-context";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase/firebaseConfig";

function Profile() {
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const { currentUser, updateProfile, logoutUser } = useAuth();

  const navigation = useNavigation();
  const { theme } = useTheme();

  /* -------- Load profile -------- */
  useEffect(() => {
    if (!currentUser?.uid) {
      Alert.alert("Session expired", "Please login again.");
      return;
    }

    setEmail(currentUser.email || "");
    setName(currentUser.displayName || "");

    async function loadProfile() {
      const snap = await getDoc(doc(db, "users", currentUser.uid));

      if (snap.exists()) {
        setLocation(snap.data().location || "");
      }
    }

    loadProfile();
  }, [currentUser]);

  /* -------- Save -------- */
  async function saveProfileHandler() {
    if (name.trim().length === 0) {
      Alert.alert("Invalid Input", "Please enter name.");
      return;
    }

    await updateProfile({ name, location });

    Alert.alert("Success", "Profile Updated", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }

  function logoutProfileHandler() {
    logoutUser();
  }

  return (
    <View
      style={[
        styles.profileContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
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
      <Section>
        <Pressable onPress={() => navigation.navigate("Shopping History")}>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            View Shopping History
          </Text>
        </Pressable>
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
