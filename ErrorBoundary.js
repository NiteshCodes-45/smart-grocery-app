import React from "react";
import { View, Text } from "react-native";

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log("CRASH:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
