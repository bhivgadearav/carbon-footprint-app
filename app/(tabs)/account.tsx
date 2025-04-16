import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { login, signInWithProvider } from '../../services/auth';

export default function AccountScreen() {
    const { user, signOut } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome, {user.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <>
          <Text>Login / Signup</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <Button title="Login" onPress={handleLogin} />
          <Button title="Continue with Google" onPress={() => signInWithProvider('google')} />
          <Button title="Continue with Apple" onPress={() => signInWithProvider('apple')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
});
  