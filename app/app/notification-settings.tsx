import { Text, View } from "react-native";
import { router } from "expo-router";
import { Appbar, Switch } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function NotificationSettings() {
  return (
    <View className="flex-1 flex-col bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-black text-white"
      >
        <Appbar.Action
          icon={() => <Icon name="arrow-left" size={20} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title={""}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4">
        <Text className="text-3xl text-white font-bold">
          Notifications settings
        </Text>
        <View className="bg-[#161618] w-full mx-auto rounded-2xl mt-8 p-4 flex flex-col space-y-6">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Icon name="sign-in" size={24} color="#FFF" />
              <View className="flex flex-col">
                <Text className="text-white font-semibold">
                  Payment requests
                </Text>
              </View>
            </View>
            <Switch value={false} />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Icon name="sign-in" size={24} color="#FFF" />
              <View className="flex flex-col">
                <Text className="text-white font-semibold">Group invites</Text>
              </View>
            </View>
            <Switch value={false} />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Icon name="sign-in" size={24} color="#FFF" />
              <View className="flex flex-col">
                <Text className="text-white font-semibold">
                  New expense in group
                </Text>
              </View>
            </View>
            <Switch value={false} />
          </View>
        </View>
      </View>
    </View>
  );
}
