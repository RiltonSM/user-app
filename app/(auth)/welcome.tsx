import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSession } from "../../context/AuthContext";

export default function WelcomePage() {
    const [message, setMessage] = useState('');

    const { user } = useSession();

    useEffect(() => {
      const getMessage = async () => {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_FIREBASE_API}/messages.json?auth=${user?.token}`);
        setMessage(response.data);
      }

      if(user?.token){
        getMessage();
      }
    }, [user?.token])
    
    return (
        <View style={styles.rootContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <Text>You authenticated successfully!</Text>
          <Text>{message}</Text>
        </View>
      );
}

const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });