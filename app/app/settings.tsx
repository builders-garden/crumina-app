import { View, Text, Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import { Redirect, router } from "expo-router";
import Avatar from "../../components/avatar";
import { shortenAddress } from "../../lib/utils";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import { useUserStore } from "../../store";
import React from "react";
import {
  QrCode,
  Bell,
  LifeBuoy,
  Shield,
  LogOut,
  ArrowLeft,
} from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";
import LogoutModal from "../../components/modals/logout-modal";

export default function Settings() {
  const { isConnected, isReady } = usePrivyWagmiProvider();
  const [showModal, setShowModal] = React.useState(false);
  const user = useUserStore((state) => state.user);

  if (!isConnected || !isReady || !user) {
    return <Redirect href={"/"} />;
  }

  return (
    <View className="flex-1 bg-black h-full">
      <LinearGradient
        colors={["#3500B7", "#1B005E", "#000000"]}
        className="h-full"
        style={{}}
      >
        <View className="flex-1 bg-white/20 h-full">
          <Appbar.Header
            elevated={false}
            statusBarHeight={48}
            className="bg-transparent text-white"
          >
            <Appbar.Action
              icon={() => <ArrowLeft size={24} color="#FFF" />}
              onPress={() => {
                router.back();
              }}
              color="#fff"
              size={24}
            />
            <Appbar.Content
              title=""
              color="#fff"
              titleStyle={{ fontWeight: "bold" }}
            />
          </Appbar.Header>
          <View className="flex-1 flex-col px-4 bg-transparent space-y-8">
            <View className="flex flex-col items-center mt-4 space-y-3">
              <Avatar name={user?.username.charAt(0).toUpperCase()} size={64} />
              <Text className="text-white text-4xl text-center font-semibold">
                {user?.displayName}
              </Text>
              <View className="flex flex-row space-x-2 items-center">
                <Text className="text-[#8F8F91] text-xl text-ellipsis">
                  @{user?.username}
                </Text>
                <QrCode
                  onPress={() => {
                    router.push("/app/qrcode");
                  }}
                  size={24}
                  color="#FFF"
                />
              </View>
            </View>
            <View className="bg-white/20 w-full mx-auto rounded-2xl p-6 flex flex-col space-y-8">
              <View className="flex flex-row items-center space-x-4">
                <LifeBuoy size={24} color="#FFF" />
                <Text className="text-white text-xl">Help</Text>
              </View>
              <Pressable
                onPress={() => {
                  router.push("/app/security-privacy");
                }}
              >
                <View className="flex flex-row items-center space-x-4">
                  <Shield size={24} color="#FFF" />
                  <Text className="text-white text-xl">Security & privacy</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/app/notification-settings");
                }}
              >
                <View className="flex flex-row items-center space-x-4">
                  <Bell size={24} color="#FFF" />
                  <Text className="text-white text-xl">
                    Notification settings
                  </Text>
                </View>
              </Pressable>
            </View>

            <View className="bg-white/20 w-full mx-auto rounded-2xl p-6 flex flex-col space-y-6">
              <Pressable
                onPress={() => {
                  setShowModal(true);
                }}
              >
                <View className="flex flex-row items-center space-x-4">
                  <LogOut size={24} color="#FFF" />
                  <Text className="text-white text-xl">Logout</Text>
                </View>
              </Pressable>
            </View>
            <LogoutModal
              visible={showModal}
              hideModal={() => setShowModal(false)}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
