import { StyleSheet, View, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform, useColorScheme, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import Spacer from '../../components/Spacer';
import { getEvents } from '../_services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native';

import { useAuth } from '../_hooks/useAuth';

const Home = () => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  const scheme = useColorScheme();
  const theme = Colors[scheme] ?? Colors.light;
  const [loading, setLoading] = useState(true);

  const { userDetails } = useAuth();

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);
        //this needs to be implemented later
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      const events = res.data || [];

      const featured = events.filter(event => event.is_featured !== 0).map(event => ({
        id: event.event_id,
        title: event.event_name,
        date: new Date(event.start_time).toDateString(),
        location: event.venue,
        image: defaultEventImg,
      }));

      const upcoming = events.filter(event => event.is_featured === 0).map(event => ({
        id: event.event_id,
        title: event.event_name,
        date: new Date(event.start_time).toDateString(),
        time: new Date(event.start_time).toLocaleTimeString(),
        location: event.venue,
        image: defaultEventImg,
      }));

      setFeaturedEvents(featured);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartProject = () => {
    router.push('/projects/create');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F388B" />

      {/* Header Section */}
      <View style={[styles.header, { paddingTop: statusBarHeight }]}>
        <View style={styles.headerContent}>
          {/* Menu Icon */}
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>

          {/* Welcome Text and User Name */}
          <View style={styles.welcomeContainer}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechBubbleText}>Welcome, How Are You?</Text>
              <View style={styles.speechBubbleTail} />
            </View>
            <Text style={styles.userName}>{userDetails?.username || 'User Name'}</Text>
          </View>

          {/* Construction Worker Character */}
          <View style={styles.characterContainer}>
            <Image
              source={require('../../assets/Avatar.png')} // You'll need to add this image
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Wave Design */}
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Grid Background */}
        <View style={styles.gridBackground}>
          {/* Create vertical lines */}
          {[...Array(20)].map((_, index) => (
            <View key={`vertical-${index}`} style={[styles.gridLine, styles.verticalLine, { left: index * 20 }]} />
          ))}
          {/* Create horizontal lines */}
          {[...Array(30)].map((_, index) => (
            <View key={`horizontal-${index}`} style={[styles.gridLine, styles.horizontalLine, { top: index * 20 }]} />
          ))}
        </View>

        {/* Start Project Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startProjectButton} onPress={handleStartProject}>
            <Ionicons name="add" size={24} color="#1F388B" style={styles.plusIcon} />
            <Text style={styles.startProjectText}>Start you Project</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1F388B',
    paddingBottom: 30,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  menuButton: {
    padding: 5,
    marginTop: 10,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    position: 'relative',
    marginBottom: 10,
  },
  speechBubbleText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  speechBubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterContainer: {
    marginLeft: 10,
    marginTop: -10,
  },
  characterImage: {
    width: 80,
    height: 120,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ scaleX: 2 }],
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#ccc',
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
  horizontalLine: {
    height: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  startProjectButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plusIcon: {
    marginBottom: 8,
  },
  startProjectText: {
    color: '#1F388B',
    fontSize: 16,
    fontWeight: '600',
  },
});