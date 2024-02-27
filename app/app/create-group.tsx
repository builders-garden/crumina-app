import { router } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView, TextInput, Text, View } from "react-native";
import { Appbar, Searchbar } from "react-native-paper";
import AppButton from "../../components/app-button";
import { createGroup, getUsers } from "../../lib/api";
import { useGroupsStore, useUserStore } from "../../store";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const addGroup = useGroupsStore((state) => state.addGroup);
  const user = useUserStore((state) => state.user);
  const [results, setResults] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const createNewGroup = async () => {
    if (groupName.length > 3) {
      const group = await createGroup(user!.token, {
        name: groupName,
        memberIds: [user!.id],
      });
      addGroup(group);
      router.back();
    }
  };

  const onChangeText = async (text: string) => {
    setSearchQuery(text);
    if (text) {
      // const docs = await getDocs()
      const users = await getUsers(user!.token, {
        limit: 10,
        query: text,
        page: 0,
      });
      console.log(users);
      setResults(users);
    } else {
      setResults([]);
    }
  };

  return (
    <View className="flex-1 flex-col bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-black text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={20} color="#FFF" />}
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
      <SafeAreaView className="flex-1 justify-between">
        <View className="flex px-4 space-y-4">
          <Text className="text-3xl text-white font-bold">Create group</Text>
          <Text className="text-white text-xl font-semibold mt-2">
            What's the name of your group?
          </Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Your new group name"
            placeholderTextColor={"#8F8F91"}
            className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
          />
          <Text className="text-white text-xl font-semibold mt-2">
            Add one or more members
          </Text>

          <Searchbar
            placeholder="@username"
            onChangeText={onChangeText}
            value={searchQuery}
            className="bg-white/10 !text-white mb-1"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholderTextColor={"#8F8F91"}
            icon={() => <Search size={20} color={"white"} />}
            // traileringIcon={() => <QrCode size={20} color={"white"} />}
            theme={{ colors: { onSurfaceVariant: "#FFF" } }}
          />
        </View>
        <View className="px-4">
          <AppButton
            variant={groupName.length > 3 ? "primary" : "disabled"}
            onPress={() => createNewGroup()}
            text="Create group"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
