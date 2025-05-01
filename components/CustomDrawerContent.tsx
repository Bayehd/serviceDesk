import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Image, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const auth = getAuth();

  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const email = currentUser.email || "";
      setUserEmail(email);

      setDisplayName(currentUser.displayName || email.split("@")[0] || "User");
    }

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const email = user.email || "";
        setUserEmail(email);
        setDisplayName(user.displayName || email.split("@")[0] || "User");
      } else {
        setUserEmail("");
        setDisplayName("User");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {

    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Image
            source={require("../assets/Profile.png")}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>
            {displayName}
          </Text>
          <Text style={{ fontSize: 14, color: "#1c3367" }}>{userEmail}</Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 10 }}>
        <DrawerItem
          label="Sign Out"
          onPress={handleSignOut}
          labelStyle={{ color: "#106ebe", fontWeight: "bold" }}
        />
      </View>
    </View>
  );
}
