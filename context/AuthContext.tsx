import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import api from '../services/api';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

interface User {
  email: string;
  token: string;
  refreshToken: string
}


const AuthContext = createContext<{
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
  session?: boolean;
  isLoading: boolean;
  isTryingToLogIn: boolean
  user: User | null
}>({
  signUp: async () => {},
  logIn: async () => {},
  logOut: () => {},
  session: false,
  isLoading: false,
  isTryingToLogIn: true,
  user: null
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTryingToLogIn, setIsTryingToLogIn] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserFromStorage = async () => {
      setIsLoading(true)
      try {
        const user = await AsyncStorage.getItem('user-app:user');
        if (user) {
          setUser(await JSON.parse(user))
          setSession(true)
          router.replace('/(auth)/welcome')
        }
      } catch (error) {
        console.log(error)
      }
      await SplashScreen.hideAsync()
      setIsLoading(false)
    }
    getUserFromStorage()
  }, [])

  const logOut = async () => {
    setSession(false)
    setUser(null)
    await AsyncStorage.removeItem('user-app:user')
  }

  const signUp = async (email: string, password: string) => {
    try {
        setIsLoading(true)
        const response = await api.post('accounts:signUp', {
            email,
            password,
            returnSecureToken: true
        })

        const user = {
            email: response.data.email,
            token: response.data.idToken,
            refreshToken: response.data.refreshToken
        }

        setUser(user)
        AsyncStorage.setItem('user-app:user', JSON.stringify(user))
        setSession(true)
        setIsLoading(false)
        router.replace('/(auth)/welcome')
    } catch (error: any) {
        console.log(error.response.data.error.message)
        setUser(null)
        setSession(false)
        setIsLoading(false)
        Alert.alert('Authentication error', 'Could not sign you up. Please check your credentials and try again')
    }
}

const logIn = async (email: string, password: string) => {
    try {
        setIsLoading(true)
        const response = await api.post('accounts:signInWithPassword', {
            email,
            password,
            returnSecureToken: true
        })
        
        setSession(true)

        const user = {
            email: response.data.email,
            token: response.data.idToken,
            refreshToken: response.data.refreshToken
        }

        setUser(user)

        AsyncStorage.setItem('user-app:user', JSON.stringify(user))

        setIsLoading(false)
        router.replace('/(auth)/welcome')
    } catch (error: any) {
        console.log(error.response.data.error.message)
        setUser(null)
        setSession(false)
        setIsLoading(false)
        Alert.alert(
          'Authentication error', 
          'Could not log you in. Please check your credentials and try again'
        )
    }
}

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        signUp,
        session,
        isLoading,
        isTryingToLogIn,
        user
      }}>
      {children}
    </AuthContext.Provider>
  );
}