import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import Buttons from "../components/Buttons";
import { useAuth } from "../store/auth-context";
import { useTheme } from "../store/theme-context";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import { useNotification } from "../notifications/NotificationProvider";

function Profile() {
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const { currentUser, userProfile, updateProfile, logoutUser, deleteAccount} = useAuth();

  const navigation = useNavigation();
  const { theme } = useTheme();
  const notify = useNotification();
  /* -------- Load profile -------- */
  useEffect(() => {
    if (!currentUser?.uid) {
      notify.info("Session expired", "Please login again.");
      return;
    }

    setEmail(currentUser.email || "");
    setName(currentUser.displayName || "");

    if (userProfile) {
      setLocation(userProfile.location || "");
    }
  }, [currentUser, userProfile]);

  const isProfileLoading = !userProfile;

  /* -------- Save -------- */
  async function saveProfileHandler() {
    if (name.trim().length === 0) {
      notify.error("Please enter name.");
      return;
    }
  
    await updateProfile({ name, location });
    notify.success('Profile updated!');
    navigation.goBack();  
  }

  function logoutProfileHandler() {
    logoutUser();
  }

  async function deleteAccountHandler() {
    const res = await deleteAccount();
    if (res?.requiresReauth) {
      notify.error(`Re-login required, ${res.message}`);
      logoutUser();
      return;
    }

    if (!res.success) {
      notify.error(res.message);
      return;
    }

    notify.success("Account deleted");
  }

  function confirmDeleteHandler() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAccountHandler,
        },
      ]
    );
  }

  const isChanged = name !== userProfile?.name || location !== userProfile?.location;
  
  if(isProfileLoading){
    <ProfileSkeleton />
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
      <View style={styles.logoutContainer}>
        <Buttons
          style={styles.dangerBtn}
          pressBtn={confirmDeleteHandler}
          disabled={!isChanged}
          btnColor="#ffe5e5"
        >
          <Text style={styles.dangerText}>DELETE ACCOUNT</Text>
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
  },
  dangerBtn: {
    marginTop: 25,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  dangerText: {
    color: "#d32f2f",
    fontWeight: "600",
  },
});

export default Profile;
