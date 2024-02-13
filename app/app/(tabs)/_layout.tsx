import { Tabs } from "expo-router";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#252526",
          borderColor: "#252526",
          borderTopWidth: 0,
          minHeight: 94,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              color={focused ? "#667DFF" : "#8F8F91"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Home",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#667DFF",
          tabBarBackground: () => <View className="bg-[#252526] flex-1" />,
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="paper-plane"
              solid={true}
              color={focused ? "#667DFF" : "#8F8F91"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Transfers",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#667DFF",
          tabBarBackground: () => <View className="bg-[#252526] flex-1" />,
        }}
      />
      <Tabs.Screen
        name="pocket"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="piggy-bank"
              color={focused ? "#667DFF" : "#8F8F91"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Groups",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#667DFF",
          tabBarBackground: () => <View className="bg-[#252526] flex-1" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="cog"
              color={focused ? "#667DFF" : "#8F8F91"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Settings",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#667DFF",
          tabBarBackground: () => <View className="bg-[#252526] flex-1" />,
        }}
      />
    </Tabs>
  );
}
