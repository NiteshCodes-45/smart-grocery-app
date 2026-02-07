import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../store/theme-context";

function Buttons({ children, pressBtn, btnColor, active }) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.pressed, styles.buttonInnerContainer]
            : [
                styles.buttonInnerContainer,
                {
                  backgroundColor: active
                    ? theme.colors.primary
                    : btnColor ? btnColor : theme.colors.secondary,
                  borderColor: active
                    ? theme.colors.primary
                    : btnColor ? btnColor : theme.colors.secondary,
                },
              ]
        }
        onPress={pressBtn}
        android_ripple={{ color: "#c3d0beff" }}
        disabled={active}
      >
        <Text style={[styles.buttonText, {
            color: theme.colors.btnText,
            fontWeight: active ? "600" : "500",
          },]}>{children}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 60,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default Buttons;
