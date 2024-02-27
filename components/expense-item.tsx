import { Pressable, View, Text } from "react-native";
import TimeAgo from "@andordavoti/react-native-timeago";
import { router } from "expo-router";
import { useProfileStore } from "../store/use-profile-store";
import { useUserStore } from "../store/use-user-store";
import { CATEGORIES, CATEGORIES_EMOJI } from "../constants/categories";
import Avatar from "./avatar";

export default function ExpenseItem({
  expense,
  index,
}: {
  expense: any;
  index: number;
}) {
  const user = useUserStore((state) => state.user);
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const setProfileUserTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );
  const { createdAt, paidBy, amount, description, category } = expense;
  return (
    <View key={`transaction-${index}`}>
      <View className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row items-center space-x-4">
          <Pressable
            key={`profile-event-${index}`}
            onPress={async () => {
              setProfileUser({
                address: paidBy.address,
                username: paidBy.username,
              });
              setProfileUserTransactions([]);
              router.push("/app/profile-modal");
            }}
          >
            <Avatar
              name={CATEGORIES_EMOJI[category as keyof typeof CATEGORIES]}
            />
          </Pressable>

          <Pressable onPress={() => router.push("/app/tx-detail-modal")}>
            <View className="flex flex-col">
              <Text className="text-white font-semibold text-lg">
                {description}
              </Text>
              <Text className="text-[#8F8F91]">
                {paidBy.username} - <TimeAgo dateTo={new Date(createdAt)} />
              </Text>
            </View>
          </Pressable>
        </View>
        <View className="flex flex-col items-end justify-center">
          <Text className={`font-semibold text-lg text-white`}>
            {amount.toFixed(2)}$
          </Text>
        </View>
      </View>
    </View>
  );
}