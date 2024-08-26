import AuthContent from "../components/Auth/AuthContent";
import * as SplashScreen from 'expo-splash-screen';
import { useSession } from "../context/AuthContext";

export default function LoginPage() {
    const { isLoading } = useSession();

    if(isLoading) {
        SplashScreen.preventAutoHideAsync();
    }
    return <AuthContent isLogin />;
}