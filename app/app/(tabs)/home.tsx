import {
  useConnectedWallet,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react-native";
import { Link, Redirect } from "expo-router";
import { View, Text, Pressable } from "react-native";
import Avatar from "../../../components/avatar";
import CircularButton from "../../../components/circular-button";
import { router } from "expo-router";
import { useTransactionsStore, useUserStore } from "../../../store";
import { ScrollView } from "react-native-gesture-handler";
import TransactionItem from "../../../components/transaction-item";
import { useProfileStore } from "../../../store/use-profile-store";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { getPayments } from "../../../lib/api";
import { USDC_ADDRESS } from "../../../constants/sepolia";
import { BigNumber } from "ethers";

export default function Home() {
  const signer = useConnectedWallet();
  // const [refreshing, setRefreshing] = React.useState(false);
  const user = useUserStore((state) => state.user);
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const setProfileUserTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );
  const transactions = useTransactionsStore((state) => state.transactions);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const { contract } = useContract(USDC_ADDRESS);
  const { data: balanceData = BigNumber.from(0) } = useContractRead(
    contract,
    "balanceOf",
    [user?.address]
  );

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    const res = await getPayments(user!.token, { limit: 3 });
    setTransactions(res as any[]);
  };

  // const { data: balanceData = BigNumber.from(0), refetch: balanceRefetch } =
  //   useContractRead(contract, "balanceOf", [user?.address]);
  // const transactions = useTransactionsStore((state) => state.transactions);
  // const setTransactions = useTransactionsStore(
  //   (state) => state.setTransactions
  // );
  // const balance = (balanceData / 10 ** 18).toFixed(2);

  // const navigation = useNavigation();

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   setTransactions([]);
  //   try {
  //     await Promise.all([balanceRefetch(), fetchTransactions()]);
  //     Toast.show({
  //       type: "success",
  //       text1: "Refreshed!",
  //       text2: "Your balance and transactions have been refreshed.",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  // React.useEffect(() => {
  //   // fetchTransactions();

  //   const refresh = async () => {
  //     await Promise.all([balanceRefetch(), fetchTransactions()]);
  //   };

  //   navigation.addListener("focus", refresh);

  //   return () => {
  //     navigation.removeListener("focus", refresh);
  //   };
  // }, []);

  // const fetchTransactions = async () => {
  //   setRefreshing(true);
  //   try {
  //     const toQ = query(
  //       collection(firebaseFirestore, "transactions"),
  //       where("to", "==", user?.address)
  //     );
  //     const fromQ = query(
  //       collection(firebaseFirestore, "transactions"),
  //       where("from", "==", user?.address)
  //     );

  //     const [toSnapshot, fromSnapshot] = await Promise.all([
  //       getDocs(toQ),
  //       getDocs(fromQ),
  //     ]);

  //     const toTransactions = toSnapshot.docs.map((doc) => {
  //       return { ...doc.data(), id: doc.id } as unknown as DBTransaction;
  //     });
  //     const fromTransactions = fromSnapshot.docs.map((doc) => {
  //       return { ...doc.data(), id: doc.id } as unknown as DBTransaction;
  //     });

  //     const transactions = [...toTransactions, ...fromTransactions].sort(
  //       (a, b) => {
  //         return (
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //         );
  //       }
  //     );
  //     setTransactions(transactions);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  if (!signer || !user) {
    return <Redirect href={"/"} />;
  }

  return (
    <LinearGradient
      colors={["#3500B7", "#1B005E", "#000000"]}
      className="h-full"
      style={{}}
    >
      <SafeAreaView className="bg-transparent flex-1">
        <View className="flex flex-col bg-transparent">
          <View className="flex flex-row items-center justify-between px-4 mt-2">
            <View className="flex flex-row items-center space-x-4 pl-2">
              <Link href={"/app/settings"}>
                <Avatar name={user.username.charAt(0).toUpperCase()} />
              </Link>
            </View>
            {/* <View className="flex flex-row items-center space-x-0">
              <IconButton
                icon={() => <Bell size={24} color={"white"} />}
                onPress={() => router.push("/app/qrcode")}
              />
            </View> */}
          </View>
          <ScrollView className="px-4" scrollEnabled={transactions.length > 0}>
            <View className="py-8 flex flex-col space-y-16">
              <View className="flex flex-col space-y-6">
                <Text className="text-white font-semibold text-center">
                  Main • USDC
                </Text>
                <Text className="text-white font-bold text-center text-5xl">
                  $
                  {balanceData
                    .div(10 ** 6)
                    .toNumber()
                    .toFixed(2)}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-evenly w-full">
                <CircularButton
                  text="Add money"
                  icon="Plus"
                  onPress={() => router.push("/app/add-money-modal")}
                />
                <CircularButton
                  text="Request"
                  icon="Download"
                  onPress={() => router.push("/app/request-modal")}
                />
                <CircularButton
                  text="Send"
                  icon="Send"
                  onPress={() => router.push("/app/transfers")}
                />
                <CircularButton
                  text="Details"
                  icon="Server"
                  onPress={() => router.push("/app/details-modal")}
                />
              </View>
            </View>
            <View className="bg-[#161618] w-full mx-auto rounded-2xl p-4">
              {transactions.length > 0 && (
                <>
                  {transactions.map((payment, index) => (
                    <TransactionItem transaction={payment} index={index} />
                  ))}
                  <Text
                    onPress={() => router.push("/app/transfers")}
                    className="text-[#0061FF] font-semibold text-center"
                  >
                    See all
                  </Text>
                </>
              )}
              {transactions.length === 0 && (
                <View className="flex flex-col items-center justify-center">
                  <Text className="text-gray-400 text-center">
                    No recent transactions available.
                  </Text>
                </View>
              )}
            </View>
            <View className="bg-[#161618] w-full mx-auto rounded-2xl mt-8 mb-16 p-4">
              {transactions.length > 0 && (
                <View className="flex flex-row items-center pb-6">
                  <Text className="text-gray-400">Recent payees</Text>
                  <ChevronRight color="grey" size={14} />
                </View>
              )}
              <View className="flex flex-row justify-evenly w-full">
                {transactions.filter((payment) => payment.payeeId !== user?.id)
                  .length > 0 && (
                  <>
                    {transactions
                      .filter((payment) => payment.payeeId !== user?.id)
                      .map((payment, index) => (
                        <Pressable
                          onPress={() => {
                            setProfileUser({
                              address: payment.payee.address,
                              username: payment.payee.username,
                            });
                            setProfileUserTransactions([]);
                            router.push("/app/profile-modal");
                          }}
                        >
                          <View className="flex space-y-2 items-center">
                            <Avatar name={payment.payee.username} />
                            <Text className="text-white font-semibold">
                              {payment.payee.username}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                  </>
                )}

                {transactions.filter((payment) => payment.payeeId !== user?.id)
                  .length === 0 && (
                  <View className="flex flex-col items-center justify-center">
                    <Text className="text-gray-400 text-center">
                      No recent payees available.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          {/* <TransactionsList
          transactions={transactions}
          loading={refreshing}
          setLoading={setRefreshing}
          setTransactions={setTransactions}
          getTransactions={getUserTransactions}
        /> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
