import { StyleSheet, View, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform, useColorScheme, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'
import { getEventByUserId } from '../_services/eventService'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import { useAuth } from '../_hooks/useAuth'

const Profile = () => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
  const scheme = useColorScheme()
  const theme = Colors[scheme] ?? Colors.light
  const { userDetails, logout } = useAuth();
  const [participationHistory, setParticipationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileData = {
    name: userDetails?.username ?? 'User',
    age: userDetails?.age ? `, ${userDetails.age}` : '',
    profileImage: userDetails?.profile_image,
    completionPercentage: '20% Complete',
    participations: participationHistory.length,
    achievements: 0
  }

  useEffect(() => {
    if (userDetails?.user_id) {
      fetchParticipationHistory();
    }
  }, [userDetails?.user_id]);

  const fetchParticipationHistory = async () => {
    try {
      setLoading(true);
      const events = await getEventByUserId(userDetails.user_id);
      
      const formattedHistory = events.map((event) => ({
        id: event.event_id,
        title: event.event_name,
        date: new Date(event.start_time).toDateString(),
        venue: event.venue,
        result: 'Participated', // This would come from actual participation data
        status: new Date(event.start_time) < new Date() ? 'Completed' : 'Upcoming'
      }));
      
      setParticipationHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to fetch participation history:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleLogout() {
    logout();
    console.log("Logging out..")
    router.replace('/login')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight, backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.title} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.profileImageContainer}>
            <Image source={userDetails?.details?.profile_image || require('../../assets/Avatar1.png')} style={styles.profileImage} />
            <View style={styles.completionBadge}>
              <ThemedText style={styles.completionText}>{profileData.completionPercentage}</ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.profileName, { color: theme.title }]}>{profileData.name}</ThemedText>

          <TouchableOpacity style={styles.editButton} onPress={() => { router.replace('/CompleteProfile') }}>
            <Ionicons name="pencil-outline" size={16} color={theme.title} />
            <ThemedText style={[styles.editButtonText, { color: theme.title }]}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="ribbon-outline" size={32} color={theme.title} />
            </View>
            <ThemedText style={[styles.statNumber, { color: theme.title }]}>{profileData.participations}</ThemedText>
            <ThemedText style={styles.statLabel}>Participations</ThemedText>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy-outline" size={32} color={theme.title} />
            </View>
            <ThemedText style={[styles.statNumber, { color: theme.title }]}>{profileData.achievements}</ThemedText>
            <ThemedText style={styles.statLabel}>Achievements</ThemedText>
          </View>
        </View>

        {/* Participation History */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <ThemedText style={[styles.historySectionTitle, { color: theme.title }]}>Participation History</ThemedText>
            {participationHistory.length > 3 && (
              <TouchableOpacity>
                <ThemedText style={[styles.viewAll, { color: theme.primary }]}>View all</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
              <ThemedText style={[styles.loadingText, { color: theme.text }]}>Loading history...</ThemedText>
            </View>
          ) : participationHistory.length === 0 ? (
            <View style={styles.emptyHistoryContainer}>
              <ThemedText style={[styles.emptyHistoryText, { color: theme.text }]}>
                No participation history yet
              </ThemedText>
            </View>
          ) : (
            participationHistory.slice(0, 3).map((item) => (
              <View key={item.id} style={[styles.historyItem, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.historyContent}>
                  <ThemedText style={[styles.historyTitle, { color: theme.title }]}>{item.title}</ThemedText>

                  <View style={styles.historyDetails}>
                    <View style={styles.historyDetailRow}>
                      <Ionicons name="calendar-outline" size={16} color={theme.text} />
                      <ThemedText style={styles.historyDetailText}>{item.date}</ThemedText>
                    </View>

                    <View style={styles.historyDetailRow}>
                      <Ionicons name="location-outline" size={16} color={theme.text} />
                      <ThemedText style={styles.historyDetailText}>{item.venue}</ThemedText>
                    </View>

                    <View style={styles.historyDetailRow}>
                      <Ionicons name="medal-outline" size={16} color={theme.text} />
                      <ThemedText style={styles.historyDetailText}>{item.result}</ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.statusContainer}>
                  <ThemedText style={[
                    styles.statusText, 
                    { color: item.status === 'Completed' ? '#4CAF50' : theme.primary }
                  ]}>
                    {item.status}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.accountSettingsSection}>
          <ThemedText style={[styles.historySectionTitle, { color: theme.title }]}>Account Settings</ThemedText>
          <View style={styles.accountSettingsCard}>
            <TouchableOpacity style={styles.accountSettingsRow}>
              <Ionicons name="settings-outline" size={20} color="#222" style={{ marginRight: 12 }} />
              <ThemedText style={styles.accountSettingsLabel}>Account Security</ThemedText>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountSettingsRow}>
              <Ionicons name="settings-outline" size={20} color="#222" style={{ marginRight: 12 }} />
              <ThemedText style={styles.accountSettingsLabel}>Language Preferences</ThemedText>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountSettingsRow}>
              <Ionicons name="settings-outline" size={20} color="#222" style={{ marginRight: 12 }} />
              <ThemedText style={styles.accountSettingsLabel}>Help and Support</ThemedText>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },


  completionBadge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },

  completionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  historySection: {
    paddingHorizontal: 16,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyDetails: {
    gap: 4,
  },
  historyDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  statusContainer: {
    marginLeft: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
  },
  emptyHistoryContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 16,
    opacity: 0.6,
  },
  accountSettingsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  accountSettingsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  accountSettingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 1,
  },
  accountSettingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountSettingsLabel: {
    fontSize: 16,
    color: '#222',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 24,
    width: '100%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
})