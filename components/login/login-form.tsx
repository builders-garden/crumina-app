import { View } from "react-native";
import AppButton from "../app-button";
import CodeInput from "./code-input";
import EmailInput from "./email-input";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import {
  usePrivy,
  useEmbeddedWallet,
  useLoginWithEmail,
  isNotCreated,
  getUserEmbeddedWallet,
} from "@privy-io/expo";
import { useCallback, useEffect, useState } from "react";
import {
  useUserStore,
  useTransactionsStore,
  useGroupsStore,
} from "../../store";
import { router } from "expo-router";
import {
  getMe,
  getPayments,
  getGroups,
  getAuthNonce,
  signIn,
} from "../../lib/api";
import { signMessageWithPrivy } from "../../lib/privy";
import { DBUser } from "../../store/interfaces";
import * as SecureStore from "expo-secure-store";
import { LoginStatus } from "../../app/index";
import { useChainStore } from "../../store/use-chain-store";
import { sepolia } from "viem/chains";
import { getPimlicoSmartAccountClient } from "../../lib/pimlico";

function LoginForm({
  loginStatus,
  setLoginStatus,
  setIsLoading,
  setLoadingMessage,
}: {
  loginStatus: LoginStatus;
  setLoginStatus: (status: LoginStatus) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string) => void;
}) {
  const { logout, user } = usePrivy();
  type PrivyUser = typeof user;
  // const { address } = usePrivyWagmiProvider();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<`${number | ""}`>("");
  const setUser = useUserStore((state) => state.setUser);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const setGroups = useGroupsStore((state) => state.setGroups);
  const setChain = useChainStore((state) => state.setChain);
  const chain = useChainStore((state) => state.chain);

  const wallet = useEmbeddedWallet();

  const { state, sendCode, loginWithCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setIsLoading(false);
      setLoginStatus(LoginStatus.CODE_ERROR);
    },
    onLoginSuccess(user, isNewUser) {
      console.log("New Actual Logged in", {
        user: JSON.stringify(user),
        isNewUser,
      });
    },
  });

  useEffect(() => {
    if (state.status === "done" && user) {
      try {
        setIsLoading(true);
        handleConnection(user)
          .then((path: string) => {
            setIsLoading(false);
            router.push(path);
          })
          .catch((e) => {
            console.error("Error Handling Connection", e);
            setIsLoading(false);
            setLoginStatus(LoginStatus.CODE_ERROR);
            router.replace("/");

            throw new Error(e);
          });
      } catch (e) {
        console.log("Error Connecting Stuffs", e);
        router.replace("/");
        throw new Error(e as any);
      }
    } else if (state.status === "initial") {
      setLoginStatus(LoginStatus.INITIAL);
    }
  }, [state, user]);

  const fetchUserData = async (token: string) => {
    const [userData, payments, groups] = await Promise.all([
      getMe(token),
      getPayments(token, { limit: 10, chainId: chain.id }),
      getGroups(token),
    ]);
    setUser({ ...userData, token } as DBUser);
    setTransactions(payments as any[]);
    setGroups(groups);
    return userData;
  };

  const handleConnection = useCallback(
    async (user: PrivyUser): Promise<string> => {
      setIsLoading(true);
      if (isNotCreated(wallet)) {
        setLoadingMessage("Creating wallet...");
        await wallet.create!();
      }

      const address = getUserEmbeddedWallet(user)?.address;

      setLoadingMessage("Signing in...");
      const { message, nonce } = await getAuthNonce();

      const provider = await wallet.getProvider!();

      const signedMessage = await signMessageWithPrivy(
        provider,
        message as `0x${string}`
      );

      const smartAccount = await getPimlicoSmartAccountClient(
        address as `0x${string}`,
        chain,
        wallet
      );

      const { isNewUser, token } = await signIn({
        address: address || getUserEmbeddedWallet(user)?.address!,
        smartAccountAddress: smartAccount?.account?.address,
        signature: signedMessage!,
        nonce,
      });

      await SecureStore.setItemAsync(`token-${address}`, token);
      if (isNewUser) {
        return "/onboarding";
      }
      setLoadingMessage("Fetching user data...");

      const userData = await fetchUserData(token);

      setChain(sepolia);
      if (!userData.username) {
        return "/onboarding";
      } else {
        return "/app/home";
      }
    },
    [user]
  );

  return (
    <View className="flex flex-col items-center space-y-3 w-full">
      {loginStatus === LoginStatus.INITIAL && (
        <EmailInput
          email={email!}
          setEmail={(email) => setEmail(email)}
          setLoginStatus={setLoginStatus}
          setCode={setCode}
          setIsLoading={setIsLoading}
          setLoadingMessage={setLoadingMessage}
        />
      )}

      {loginStatus === LoginStatus.SUCCESS_EMAIL && (
        <CodeInput
          code={code}
          email={email!}
          setCode={setCode}
          setIsLoading={setIsLoading}
          setLoginStatus={setLoginStatus}
          setLoadingMessage={setLoadingMessage}
          sendCode={sendCode}
          loginWithCode={loginWithCode}
        />
      )}

      {state.status === "error" && (
        <View className="w-full ">
          <AppButton
            onPress={async () => {
              console.error("Try again");
              setEmail("");
              setCode("");
              await logout();
            }}
            text="Try again"
          />
        </View>
      )}
    </View>
  );
}

export default LoginForm;
