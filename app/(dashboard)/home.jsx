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
import { getEvents } from '../services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native';


import { useAuth } from '../hooks/useAuth';


const defaultEventImg = 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800';

const quickAccess = [
  { label: 'My Certificates', icon: <MaterialCommunityIcons name="certificate" size={32} color="#02728e" />, onPress: () => { }, },
  { label: 'Saved Events', icon: <MaterialCommunityIcons name="bookmark" size={32} color="#02728e" />, onPress: () => { }, },
  { label: 'Event History', icon: <MaterialCommunityIcons name="notebook" size={32} color="#02728e" />, onPress: () => { }, },
  { label: 'Leaderboard', icon: <MaterialCommunityIcons name="trophy" size={32} color="#02728e" />, onPress: () => { }, },
];

const communityFeed = [
  { id: 1, name: 'Arya', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', time: '2 hours ago', message: 'Community feed post example.' },
  { id: 2, name: 'Sowjanya', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', time: '2 hours ago', message: 'Another community feed post.' },
];

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

      const featured = events.filter(event => event.is_featured  !== 0).map(event => ({
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
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden'
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoText: {
    fontFamily: 'cursive',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 16,
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: 300,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  dateTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dateText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredLocation: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  registerButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  eventCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  eventRegisterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  eventRegisterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickAccessSection: {
    padding: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderRadius: 16,
    marginHorizontal: 8,
    marginTop: 16,
  },
  quickAccessTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessBtn: {
    width: '47%',
    aspectRatio: 1.9,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  quickAccessLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  communityFeedSection: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  communityFeedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityFeedTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  communityFeedViewAll: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 15,
  },
  feedCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  feedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  feedName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedTime: {
    fontSize: 12,
    color: '#888',
  },
  feedMessage: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
  eventsFallbackContainer: {
    paddingVertical: 30,
    width: '100%',
    alignItems: 'center',
    // borderWidth:1,
    // borderColor: 'red'

  },
  eventsFallbackText: {
    fontSize: 24,
    fontWeight: 900,
    opacity: 0.6,
    fontWeight: 700,
    color:'#02728e',
    paddingBottom:40
  }


})