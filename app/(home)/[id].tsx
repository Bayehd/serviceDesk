import { useLocalSearchParams } from "expo-router";

export default function User()  {
    const { id} = useLocalSearchParams();
    console.log("id:",id);
}