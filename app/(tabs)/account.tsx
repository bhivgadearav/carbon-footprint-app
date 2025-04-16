import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { login, signup } from '../../services/auth';

const AccountScreen = () => {
  const { user, setUser, signOut } = useContext(AuthContext);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      setError('');
      if (mode === 'login') {
        const loggedInUser = await login(email, password);
        setUser(loggedInUser);
      } else {
        const signedUpUser = await signup(email, password);
        setUser(signedUpUser);
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
      console.error('Authentication error:', err);
    }
  };

  const renderAuthForm = () => (
    <>
      <Text style={styles.header}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
      {error.length > 0 && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Pressable style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        <Text style={styles.switchMode}>
          {mode === 'login' ? 'New here? Sign Up' : 'Already have an account? Login'}
        </Text>
      </Pressable>
    </>
  );

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Image
              source={require('@/assets/images/plant.png')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.header}>Welcome, {user.email}</Text>
          <Pressable style={styles.button} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        </>
      ) : (
        renderAuthForm()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  switchMode: {
    textAlign: 'center',
    color: '#16a34a',
    marginTop: 10,
    fontSize: 14,
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
});

export default AccountScreen;