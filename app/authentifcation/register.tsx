import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../../backend/config';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');      
  const [password, setPassword] = useState(''); 
  const router = useRouter();                   

  // Called when user taps the "Register" button
  const handleRegister = async () => {
    // Check if all fields are filled
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      console.log('Password must be at least 6 characters');
      Alert.alert('Registration Failed', 'Password must be at least 6 characters');
      return;
    }

    try {
      // Create a new user account with Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);

      // Show success message and go to home screen (or wherever you want)
      console.log('Registered successfully!');
      router.replace('/authentifcation/login');
    } catch (error: any) {
      // Show error if Firebase throws one (e.g., email already in use)
      console.log('Registration failed:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      {/* option for guests to login an continue*/} 
      <Text
        style={styles.guest}
        onPress={() => router.replace('/tabs')}
      >
        Continue as Guest
      </Text>
      {/* Email input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="#999"
        style={[styles.input, { color: '#fff', borderColor: '#555' }]}
      />

      {/* Password input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
        style={[styles.input, { color: '#fff', borderColor: '#555' }]}
      />

      {/* Register button */}
      <Button title="Register" onPress={handleRegister} />

      {/* Link to Login screen if user already has account */}
      <Text
        style={styles.link}
        onPress={() => router.push('/authentifcation/login')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}

// register screen
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