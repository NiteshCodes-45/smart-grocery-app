import { View, Text, Pressable, StyleSheet } from "react-native";

function Buttons({ children, pressBtn, btnColor }) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.pressed, styles.buttonInnerContainer]
            : styles.buttonInnerContainer
        }
        onPress={pressBtn}
        android_ripple={{ color: "#c3d0beff" }}
      >
        <Text style={styles.buttonText}>{children}</Text>
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
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight:"bold"
  },
  pressed: {
    opacity: 0.75,
  },
});

export default Buttons;
