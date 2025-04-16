import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContext } from "@/context/AuthContext";

export default function Layout() {
    return (
        <AuthContext.Provider value={{ user: null, setUser: () => {}, signOut: () => {} }}>
            <GestureHandlerRootView>
                <Stack 
                screenOptions={{
                    headerShown: false
                }}
                >
                </Stack>
            </GestureHandlerRootView>
        </AuthContext.Provider>
    )
}