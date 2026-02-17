import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { getEvents } from '../_services/eventService'; 
import ThemedText from '../../components/ThemedText';
import { getEventByUserId } from '../_services/eventService'; 


import { useAuth } from '../_hooks/useAuth';  

const Event = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { userDetails }  = useAuth();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  const scheme = useColorScheme();
  const theme = Colors[scheme] ?? Colors.light;

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
  }, [userDetails?.user_id]);

  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      const apiData = response.data ;

      const formattedEvents = apiData.map((event) => ({
        id: event.event_id,
        title: event.event_name,
        date: new Date(event.start_time).toDateString(),
        time: new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: event.venue,
        image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
        registered : event.registered,
        max_registration : event.participant_limit
      }));

      setAllEvents(formattedEvents);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const fetchMyEvents = async () => {
  try {
    if (!userDetails?.user_id) return;

    const apiData = await getEventByUserId(userDetails.user_id); 

    const formattedEvents = apiData.map((event) => ({
      id: event.event_id,
      title: event.event_name,
      date: new Date(event.start_time).toDateString(),
      time: new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: event.venue,
      image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
      registered: event.registered,
      max_registration: event.participant_limit
    }));

    setMyEvents(formattedEvents);
  } catch (error) {
    console.error('Failed to fetch my events:', error);
  }
};

  const eventsToShow = activeTab === 'all' ? allEvents : myEvents;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      <View style={[styles.header, { paddingTop: statusBarHeight, backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.title} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Events</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'all' && { backgroundColor: theme.primary },
          ]}
          onPress={() => setActiveTab('all')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'all' && { color: 'white' }]}>
            All Events
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'my' && { backgroundColor: theme.primary },
          ]}
          onPress={() => setActiveTab('my')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'my' && { color: 'white' }]}>
            My Events
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
        ) : eventsToShow.length === 0 ? (
          <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>
            {activeTab === 'all' ? 'No events available.' : 'You have no past events.'}
          </ThemedText>
        ) : (
          eventsToShow.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { backgroundColor: theme.cardBackground }]}
              onPress={() => router.push(`/eventDetails?event_id=${event.id}&isMyEvent=${activeTab === 'my'}`)}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <ThemedText style={[styles.eventTitle, { color: theme.title }]}>
                    {event.title}
                  </ThemedText>
                  <Ionicons name="bookmark-outline" size={20} color={theme.text} />
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="calendar-outline" size={16} color={theme.text} />
                    <ThemedText style={styles.eventDetailText}>{event.date}</ThemedText>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="time-outline" size={16} color={theme.text} />
                    <ThemedText style={styles.eventDetailText}>{event.time}</ThemedText>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="location-outline" size={16} color={theme.text} />
                    <ThemedText style={styles.eventDetailText}>{event.location}</ThemedText>
                  </View>
                </View>
            {activeTab === 'all' && (
                <TouchableOpacity
                  style={[styles.registerButton, { backgroundColor: theme.primary }]}
                  onPress={()=>{router.push(`/registerEvent?event_id=${event.id}`)}}
                >
                  <ThemedText style={styles.registerButtonText}>Register</ThemedText>
                </TouchableOpacity>
            )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Event;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
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
    height: 160,
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  registerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
