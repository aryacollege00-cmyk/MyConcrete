import { StyleSheet, View, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getEventById } from './_services/eventService';

import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';

const attendeeImages = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg'
];

const EventDetails = () => {
  const { event_id, isMyEvent } = useLocalSearchParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const theme = Colors[scheme] ?? Colors.light;
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  
  const isMyOwnEvent = isMyEvent === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEventById(event_id);
        setEventData({
          title: data.event_name,
          date: new Date(data.start_time).toDateString(),
          time: new Date(data.start_time).toLocaleTimeString(),
          location: data.venue,
          price: `₹${data.entry_fee}`,
          description: data.rules || 'No description provided.',
          image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
          attendees: `${data.registered}+ Going`,
          is_participant: data.is_participant
        });
        console.log(data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [event_id]);

  if (loading || !eventData) {
    return (
      <ThemedView safe style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.text} />
      </ThemedView>
    );
  }

  return (
    <ThemedView safe style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: eventData.image }} style={styles.heroImage} />
          <View style={[styles.heroOverlay, { paddingTop: statusBarHeight }]}>
            <View style={styles.heroHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.attendeesContainer}>
              <View style={styles.attendeeImages}>
                {attendeeImages.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={[styles.attendeeImage, { marginLeft: index > 0 ? -8 : 0 }]}
                  />
                ))}
              </View>
              <ThemedText style={styles.attendeesText}>{eventData.attendees}</ThemedText>
              <TouchableOpacity style={styles.inviteButton}>
                <ThemedText style={styles.inviteButtonText}>Invite</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.detailsContainer, { backgroundColor: theme.cardBackground }]}>
          <ThemedText style={[styles.eventTitle, { color: theme.title }]}>{eventData.title}</ThemedText>

          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.text} />
              <ThemedText style={styles.infoText}>{eventData.date}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={theme.text} />
              <ThemedText style={styles.infoText}>{eventData.time}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.text} />
              <ThemedText style={styles.infoText}>{eventData.location}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={theme.text} />
              <ThemedText style={styles.infoText}>{eventData.price}</ThemedText>
            </View>
          </View>

          <View style={styles.aboutSection}>
            <ThemedText style={[styles.sectionTitle, { color: theme.title }]}>About Event</ThemedText>
            <ThemedText style={styles.description}>{eventData.description}</ThemedText>
          </View>
        </View>
      </ScrollView>
{ !isMyOwnEvent  && (
      <View style={[
        styles.registerContainer,
        { backgroundColor: theme.cardBackground, paddingBottom: insets.bottom + 5 }
      ]}>
        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push(`/registerEvent?event_id=${event_id}`)  }
        >
          {
            eventData.is_participant && <ThemedText style={styles.registerButtonText} >My Team</ThemedText>
          }
          {
            !eventData.is_participant && <ThemedText style={styles.registerButtonText} >Register Now</ThemedText>
          }
          
        </TouchableOpacity>
      </View>)}
    </ThemedView>
  );
};

export default EventDetails;


const styles = StyleSheet.create({
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'auto',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 'auto'
  },
  attendeeImages: {
    flexDirection: 'row',
    marginRight: 8,
  },
  attendeeImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  attendeesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  inviteButton: {
    backgroundColor: '#2F4F9A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  eventInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  aboutSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  registerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})