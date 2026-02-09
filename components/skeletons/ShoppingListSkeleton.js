import { View } from "react-native";
import ShoppingItemSkeleton from "./ShoppingItemSkeleton";

export default function ShoppingListSkeleton({ count = 6 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ShoppingItemSkeleton key={i} />
      ))}
    </View>
  );
}

