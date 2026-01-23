import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "APP_SETTINGS";

/* Save settings */
export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.log("Error saving settings", error);
  }
}

/* Load settings */
export async function loadSettings() {
  try {
    const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
    return storedSettings ? JSON.parse(storedSettings) : null;
  } catch (error) {
    console.log("Error loading settings", error);
    return null;
  }
}
