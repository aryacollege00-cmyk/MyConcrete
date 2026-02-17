import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

const avatars = [
  { id: 1, source: require('../../assets/Avatar1.png') },
  { id: 2, source: require('../../assets/Avatar2.png') },
  { id: 3, source: require('../../assets/Avatar3.png') },
  { id: 4, source: require('../../assets/Avatar4.png') },
];

const sportsInterests = [
  'Football', 'Basketball', 'Tennis', 'Cricket', 'Badminton', 
  'Swimming', 'Running', 'Cycling', 'Volleyball', 'Table Tennis',
  'Golf', 'Baseball', 'Hockey', 'Boxing', 'Wrestling'
];

export default function BasicProfileCompletion() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterests, setShowInterests] = useState(false);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleConfirm = async () => {
    if (!selectedAvatar) {
      alert('Please select an avatar');
      return;
    }

    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('userAvatar', JSON.stringify(selectedAvatar));
      await AsyncStorage.setItem('userInterests', JSON.stringify(selectedInterests));
      
      console.log('Profile data saved:', { selectedAvatar, selectedInterests });
      
      // Navigate to home
      router.replace('/home');
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Complete your{'\n'}Profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionTitle}>Choose your Avatar</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a fun Avatar or add your own profile photo!
          </Text>

          <View style={styles.avatarContainer}>
            {avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar?.id === avatar.id && styles.selectedAvatar
                ]}
                onPress={() => handleAvatarSelect(avatar)}
              >
                <Image source={avatar.source} style={styles.avatarImage} />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.addAvatarOption}>
              <Ionicons name="add" size={32} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.interestsSection}>
          <TouchableOpacity 
            style={styles.interestsDropdown}
            onPress={() => setShowInterests(!showInterests)}
          >
            <Text style={styles.interestsPlaceholder}>
              {selectedInterests.length > 0 
                ? `${selectedInterests.length} sports selected` 
                : 'Sports you are interested in'
              }
            </Text>
            <Ionicons 
              name={showInterests ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {showInterests && (
            <View style={styles.interestsGrid}>
              {sportsInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.selectedInterest
                  ]}
                  onPress={() => handleInterestToggle(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
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
    color: '#333',
    lineHeight: 40,
  },
  avatarSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selectedAvatar: {
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addAvatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  interestsSection: {
    marginBottom: 40,
  },
  interestsDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  interestsPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  selectedInterest: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  interestText: {
    fontSize: 14,
    color: '#666',
  },
  selectedInterestText: {
    color: 'white',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});