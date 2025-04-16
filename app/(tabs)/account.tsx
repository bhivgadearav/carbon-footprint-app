// src/screens/AccountScreen.tsx

import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { login, signup } from '../../services/auth';

const AccountScreen = () => {
  const { user, setUser, signOut } = useContext(AuthContext);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    try {
      if (mode === 'login') {
        const loggedInUser = await login(email, password);
        setUser(loggedInUser);
      } else {
        const signedUpUser = await signup(email, password);
        setUser(signedUpUser);
      }
    } catch (error) {
      console.error('Authentication error:', error);
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
          <Text style={styles.header}>
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Text>
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
          <Button
            title={mode === 'login' ? 'Login' : 'Sign Up'}
            onPress={handleAuth}
          />
          <Button
            title={`Switch to ${mode === 'login' ? 'Sign Up' : 'Login'}`}
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
});

export default AccountScreen;
