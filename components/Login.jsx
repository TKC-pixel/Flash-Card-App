import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { loginUser } from '../components/firebase'; 
import userIcon from '../assets/user.gif';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigation.navigate('Main');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setMessage('Invalid email format. Please try again.');
      } else if (error.code === 'auth/wrong-password') {
        setMessage('Incorrect password. Please try again.');
      } else {
        setMessage('User not found. Please register.');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image source={userIcon} style={styles.userIcon} />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {message && <Text style={styles.message}>{message}</Text>}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate('CreateAccount')} style={styles.link}>
        Don't have an account? Register
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  userIcon: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    top: -70,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    color: 'grey',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
  },
});

export default Login;
