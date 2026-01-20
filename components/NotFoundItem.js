import { View, StyleSheet } from "react-native";
import Buttons from "./Buttons";

function NotFoundItem({children}) {
  return (
    <View
      style={styles.notFoundContainer}
    >
      <Buttons color="#090909ff">{children}</Buttons>
    </View>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    },
});

export default NotFoundItem;
