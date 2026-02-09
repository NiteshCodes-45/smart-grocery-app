import { View } from "react-native";
import SessionHistorySkeleton from "./SessionHistorySkeleton";

export default function SessionHistoryListSkeleton({ count = 5 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <SessionHistorySkeleton key={i} />
      ))}
    </View>
  );
}
