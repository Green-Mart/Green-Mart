import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { registerUser } from '../api/registerApi';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = ({navigation}) => {
//   const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    passwd: '',
    mobile: '',
    role: '', // Optional
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    try {
        debugger
      const { name, email, passwd, mobile } = form;

      if (!name || !email || !passwd || !mobile) {
        Alert.alert('Validation', 'All fields are required!');
        return;
      }

      const response = await registerUser(form);
      if (response.data.status == 'success') {
        alert('Registered successfully!');
        navigation.navigate('Login');
      } else {
        alert('Error', response.data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Error', err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={form.passwd}
        onChangeText={(text) => handleChange('passwd', text)}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        placeholder="Mobile"
        value={form.mobile}
        onChangeText={(text) => handleChange('mobile', text)}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Role (optional)"
        value={form.role}
        onChangeText={(text) => handleChange('role', text)}
        style={styles.input}
      />

      <Button title="Register" onPress={handleRegister} color="#2b8a3e" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#2b8a3e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
});

export default RegisterScreen;
