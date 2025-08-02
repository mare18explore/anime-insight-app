import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../../backend/config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');       
  const [password, setPassword] = useState(''); 
  const router = useRouter();                   

  // Function to handle login when button is pressed
  const handleLogin = async () => {
    // Basic check: all fields filled?
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // min password length
    if (password.length < 6) {
      console.log('Password must be at least 6 characters');
      return;
    }

    try {
      // Firebase login function — checks credentials
      await signInWithEmailAndPassword(auth, email, password);

      // successful, show message and navigate
      console.log('Login successful!');
       // redirect to homepage or dashboard
       router.replace('/tabs');
    } catch (error: any) {
      // Handle common Firebase auth errors nicely
      let msg = error.message;

      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with that email.';
      } else if (error.code === 'auth/wrong-password') {
        msg = 'Incorrect password.';
      }

      // Show error lert
      console.log('Login failed', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
       {/* option for guests to login an continue*/} 
      <Text
        style={styles.guest}
        onPress={() => router.replace('/tabs')}
      >
        Continue as Guest
      </Text>

      {/* Email input field */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="#999"
        style={[styles.input, { color: '#fff', borderColor: '#555' }]}
      />

      {/* Password input field */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
        style={[styles.input, { color: '#fff', borderColor: '#555' }]}
      />

      {/* Login button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Link to register screen */}
      <Text
        style={styles.link}
        onPress={() => router.push('/authentifcation/register')}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}

// Styling for the login screen
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center'
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    color: '#black',
  },
  link: {
    color: 'blue',
    marginTop: 12,
    textAlign: 'center'
  },
  guest: {
    color: '#4af',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});