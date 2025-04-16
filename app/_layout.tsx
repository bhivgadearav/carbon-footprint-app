import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";
import BarcodeScanner from "./scan";

export default function Layout() {
    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <Stack 
                screenOptions={{
                    headerShown: false
                }}
                >
                    <Stack.Screen name="scan"
                options={{
                    headerShown: true,
                    headerTitle: "Scan Product",
                    headerBackTitle: "Go Back"
                }} />
                </Stack>
            </GestureHandlerRootView>
        </AuthProvider>
    )
}