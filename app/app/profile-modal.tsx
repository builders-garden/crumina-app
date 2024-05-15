import { Link, router, useLocalSearchParams } from "expo-router";
import { View, ScrollView, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import CircularButton from "../../components/circular-button";
import { ArrowLeft } from "lucide-react-native";
import { useUserStore } from "../../store";
import { useEffect, useMemo, useState } from "react";
import { getPayments, getUserByIdUsernameOrAddress } from "../../lib/api";
import TransactionItem from "../../components/transaction-item";
import { useChainStore } from "../../store/use-chain-store";
import TransactionSkeletonLayout from "../../components/skeleton-layout/transactions";
import {
  DisplayNameSkeletonLayout,
  UsernameSkeletonLayout,
} from "../../components/skeleton-layout/profile-name";
import { DBTransaction } from "../../store/interfaces";
import TimeAgo from "@andordavoti/react-native-timeago";
import { getFormattedTime, isTodayOrYesterday } from "../../lib/utils";
import { useColorScheme } from "nativewind";

export default function ProfileModal() {
  const isPresented = router.canGoBack();
  const { userId } = useLocalSearchParams();
  const currentUser = useUserStore((state) => state.user);
  const [fetching, setFetchingData] = useState(true);
  const [profileUser, setProfileUser] = useState<any>();
  const [transactions, setTransaction] = useState<DBTransaction[]>([]);
  const chain = useChainStore((state) => state.chain);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const fetchUser = async () => {
    setFetchingData(true);
    const [profile, transactions] = await Promise.all([
      getUserByIdUsernameOrAddress(currentUser!.token, {
        idOrUsernameOrAddress: userId!.toString(),
      }),
      getPayments(currentUser!.token, {
        withUserId: parseInt(userId as string, 10),
        chainId: chain.id,
      }),
    ]);
    setProfileUser(profile);
    setTransaction(transactions as unknown as DBTransaction[]);
    setFetchingData(false);
  };

  const transactionsByDay = useMemo(() => {
    return transactions.reduce<
      Record<string, { transactions: DBTransaction[] }>
    >((prev, cur, index, arr) => {
      const date = cur.createdAt.split("T")[0];
      const transaction = arr[index];

      prev[date] = {
        transactions: [...(prev[date]?.transactions || []), transaction],
      };

      return prev;
    }, {});
  }, [transactions]);

  const dates = Object.keys(transactionsByDay);

  return (
    <View className="flex-1 flex-col bg-absoluteWhite dark:bg-black">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-absoluteWhite dark:bg-black text-darkGrey dark:text-white"
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeft
              size={24}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#fff" : "#161618"}
          size={24}
          animated={false}
        />
        <Appbar.Content
          title=""
          color={colorScheme === "dark" ? "#fff" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex flex-col justify-between px-4">
        <View className="flex flex-col items-center mt-4- space-y-3">
          <Avatar
            name={profileUser?.displayName?.charAt(0)?.toUpperCase() || ""}
            uri={profileUser?.avatarUrl}
            size={64}
          />
          <View className="flex flex-col items-center">
            {fetching ? (
              <DisplayNameSkeletonLayout isDark={colorScheme === "dark"} />
            ) : (
              <Text className="text-darkGrey dark:text-white text-4xl text-center font-semibold">
                {profileUser?.displayName}
              </Text>
            )}
            {fetching ? (
              <UsernameSkeletonLayout isDark={colorScheme === "dark"} />
            ) : (
              <Text className="text-mutedGrey text-xl text-ellipsis text-center">
                @{profileUser?.username}
              </Text>
            )}
          </View>
        </View>

        <View className="flex flex-row items-center justify-center space-x-8 py-8">
          <View>
            <CircularButton
              text="Request"
              icon="Download"
              onPress={() => router.push("/app/request-modal")}
            />
          </View>
          <View>
            <CircularButton
              text="Send"
              icon="Send"
              onPress={() => {
                if (!profileUser) return;
                router.push({
                  pathname: "/app/send-modal",
                  params: { user: JSON.stringify(profileUser) },
                });
              }}
            />
          </View>
        </View>

        <View className="bg-white dark:bg-darkGrey w-full mx-auto rounded-lg p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Total sent
            </Text>
            <Text className="text-darkGrey dark:text-white text-lg font-medium">
              {!fetching
                ? `$${profileUser.paymentInfo.out.toFixed(2)}`
                : "--.--"}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Total received
            </Text>
            <Text className="text-darkGrey dark:text-white text-lg font-medium">
              {!fetching
                ? `$${profileUser.paymentInfo.in.toFixed(2)}`
                : "--.--"}
            </Text>
          </View>
        </View>
        {fetching && (
          <ScrollView className="bg-white dark:bg-darkGrey w-full mx-auto rounded-lg p-4 space-y-4 mt-8">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <TransactionSkeletonLayout
                  key={i}
                  isDark={colorScheme === "dark"}
                />
              ))}
          </ScrollView>
        )}
        {!fetching && dates?.length === 0 && (
          <View className="mt-4">
            <Text className="text-darkGrey dark:text-white text-center">
              No payments yet with {profileUser?.username}
            </Text>
          </View>
        )}

        {!fetching && dates?.length > 0 && (
          <ScrollView className="w-full space-y-4 mt-8">
            {dates.map((date) => {
              const transactionList = transactionsByDay[date].transactions;
              return (
                <View key={date} className="w-full rounded-lg">
                  <Text className="text-xl text-darkGrey dark:text-white font-medium mb-2.5">
                    {isTodayOrYesterday(date) || (
                      <TimeAgo dateTo={new Date(date)} />
                    )}
                  </Text>
                  <View className="bg-white dark:bg-darkGrey w-full rounded-lg px-4 space-y-4">
                    {transactionList.map((transaction, index) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        index={index}
                        time={getFormattedTime(transaction.createdAt)}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
