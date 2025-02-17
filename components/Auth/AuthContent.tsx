import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';
import { router } from 'expo-router';
import { useSession } from '../../context/AuthContext';
import LoadingOverlay from '../ui/LoadingOverlay';

interface AuthContentProps {
    isLogin?: boolean;
}

type CredentialsType = {
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
}

function AuthContent({ isLogin = false }: AuthContentProps) {

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  const { logIn, signUp, isLoading } = useSession()

  function switchAuthModeHandler() {
    router.push(isLogin ? '/sign_up' : '/');
  }

  async function submitHandler(credentials: CredentialsType) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }

    if (isLogin) {
      await logIn(email, password)
    } else {
      await signUp(email, password)
    }
  }

  if (isLoading) {
    return <LoadingOverlay message={ isLogin ? 'Logging in...' : 'Creating user...'}/>
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? 'Create a new user' : 'Log in instead'}
        </FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});