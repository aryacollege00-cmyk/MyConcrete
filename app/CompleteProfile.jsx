import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { updateUser } from './services/authService';

export default function CompleteProfile() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await updateUser({
        firstname,
        lastname,
        gender,
        age,
        interests,
        phone,
      });
      console.log(res.data);
      setLoading(false);
      router.replace('/home');
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError('Server error or invalid input');
    }
  };

  return (  
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/profile')}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Complete Profile</Text>
          <Text style={styles.subtitle}>Tell us a bit about you</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            placeholder="First Name"
            value={firstname}
            onChangeText={setFirstname}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastname}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Interests"
            value={interests}
            onChangeText={setInterests}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Phone Number"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor="#999"
          />

          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.finishButton} onPress={handleComplete} disabled={loading}>
          {loading ? (
            <ActivityIndicator size='small' color='#ffffff'/>
          ) : (
            <Text style={styles.finishText}>Finish</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
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
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  finishButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});