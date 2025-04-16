import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";

export default function Layout() {
    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <Stack 
                screenOptions={{
                    headerShown: false
                }}
                >
                </Stack>
            </GestureHandlerRootView>
        </AuthProvider>
    )
}