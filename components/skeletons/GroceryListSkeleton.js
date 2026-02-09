import { View } from "react-native";
import GroceryItemSkeleton from "./GroceryItemSkeleton";

export default function GroceryListSkeleton({ count = 6 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <GroceryItemSkeleton key={index} />
      ))}
    </View>
  );
}
