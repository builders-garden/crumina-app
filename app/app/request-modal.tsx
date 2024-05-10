import { Link, router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import { useUserStore } from "../../store";
import AppButton from "../../components/app-button";
import { ArrowLeft, Copy } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Share } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useColorScheme } from "nativewind";

export default function RequestModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const { colorScheme } = useColorScheme();

  if (!user) {
    return <View className="flex-1 bg-white dark:bg-black" />;
  }

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-white dark:bg-darkGrey"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-white dark:bg-darkGrey text-darkGrey dark:text-white"
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
          size={20}
        />
        <Appbar.Content
          title={""}
          color={colorScheme === "dark" ? "#fff" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4 h-full">
        <Text className="text-3xl text-darkGrey dark:text-white font-bold">
          Request via link
        </Text>
        <View className="flex items-center space-y-2 mt-4">
          <Avatar name={user?.displayName.charAt(0)} size={64} />
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-darkGrey dark:text-white font-semibold text-lg">
              {user?.username}
            </Text>
            <Pressable onPress={() => router.push("/app/qrcode")}>
              <Image
                className="h-5 w-5 border "
                source={require("../../images/icons/qrcode-scan.png")}
              />
            </Pressable>
          </View>
          <Text className="text-gray-400 text-lg">
            Share your link so anyone can pay you
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(
                `https://plink.finance/u/${user?.username}`
              );
            }}
          >
            <View className="flex flex-row items-center space-x-2">
              <Copy size={20} color="#FF238C" />
              <Text className="text-[#FF238C] font-bold text-lg">
                plink.finance/u/{user?.username}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex flex-grow" />
        <SafeAreaView className="flex flex-col mb-24">
          <View className="mb-4">
            <AppButton
              text="Share link"
              variant="primary"
              onPress={async () => {
                await Share.share({
                  message: `gm! join me on Plink using this link: https://plink.finance/u/${user?.username}`,
                });
              }}
            />
          </View>
          <AppButton
            text="Request a specific amount"
            variant="ghost"
            onPress={() => router.replace("/app/specific-request-modal")}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
