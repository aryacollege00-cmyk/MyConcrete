import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import Spacer from '../../components/Spacer';
import { Colors } from '../../constants/Colors';
import ThemedText from '../../components/ThemedText';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    // if (!username.trim()) return setError('Username is required.');
    if (!email.trim()) return setError('Email is required.');
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (!password.trim()) return setError('Password is required.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setError('');

    try {
      setLoading(true);
      await register({ username, email_id: email, password });
      router.replace(`/verify?email_id=${encodeURIComponent(email)}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Register error ->', error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <Spacer height={20} />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Let's sign{'\n'}you up!</Text>
          <Text style={styles.subtitle}>
            Get started with a few easy steps to access all the features. Your journey begins ere!
          </Text>
        </View>


        {/* Form */}
        {/* <View style={styles.form}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#999"
          /> */}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Re-enter Password"
            value={confirm}
            secureTextEntry
            onChangeText={setConfirm}
            style={styles.input}
            placeholderTextColor="#999"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Spacer height={40} />

          <TouchableOpacity style={styles.sendOtpButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator size='small' color='#ffffff'/>
            ) : (
              <Text style={styles.sendOtpText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          <Spacer height={20} />

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" style={styles.loginLink}>Login Now</Link>
          </View>
        </View>
      {/* </View> */}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#000'
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  sendOtpButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendOtpText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});