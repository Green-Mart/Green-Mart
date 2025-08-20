import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/Base_Url';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [passwd, setPassword] = useState('');

  const handleLogin = async () => {debugger
  try {
    // debugger
    const response = await axios.post(`${BASE_URL}/users/signin`, {
      email,
      passwd,
    });
    
    if (response.data.status == 'success') {
      const userData = response.data.data;
      
      // ✅ Save token and user info locally (AsyncStorage or Redux)
      // await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('user', JSON.stringify({
        userId: userData.userId,
        token: userData.token
      }));
 
      // ✅ Navigate to Home or Main screen
      navigation.navigate('Welcome_Home');
    } else {
      alert("Login Failed", response.data.error);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error", "Something went wrong during login.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        value={passwd}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' },
});

export default Login;
