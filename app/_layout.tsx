import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Colors } from "../constants/styles";
import { SessionProvider } from "../context/AuthContext";


const StackNavigatorRoot = () => {
    return(
        <Stack 
            initialRouteName="index"
            screenOptions={{
                contentStyle: { backgroundColor: Colors.primary100 },
                statusBarColor: Colors.primary800,
                statusBarStyle: 'light',
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="sign_up" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    )
}

export default function RootLayout() {
    SplashScreen.preventAutoHideAsync();

    return( 
        <SessionProvider>
            <StackNavigatorRoot/>
        </SessionProvider>
    )
}