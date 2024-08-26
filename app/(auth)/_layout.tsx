import { Redirect, Stack } from "expo-router";
import { useSession } from "../../context/AuthContext";
import IconButton from "../../components/ui/IconButton";
import { Colors } from "../../constants/styles";

export default function AuthenticatedLayout() {
    const { session, logOut } = useSession()

    if (!session) {
        return <Redirect href="/" />
    }

    return (
        <Stack 
            initialRouteName="welcome"
            screenOptions={{
                headerStyle: { 
                    backgroundColor: Colors.primary800,
                },
                headerTintColor: 'white',
                contentStyle: { backgroundColor: Colors.primary100 },
            }}
        >
            <Stack.Screen 
                name="welcome" 
                options={{
                    headerRight: ({ tintColor}) => <IconButton icon="exit" size={24} color={tintColor} onPress={logOut}/>,
                }}

            />
        </Stack>    
    )
}