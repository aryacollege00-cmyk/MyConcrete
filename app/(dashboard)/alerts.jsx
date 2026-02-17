import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  useColorScheme,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../constants/Colors'
import { getAlerts } from '../services/alertService'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import { useAuth } from '../hooks/useAuth'
import { Ionicons } from '@expo/vector-icons'

const profileImg = 'https://randomuser.me/api/portraits/men/1.jpg'

const Alerts = () => {
  const navigation = useNavigation()
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
  const scheme = useColorScheme();
  const theme = Colors[scheme] ?? Colors.light;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userDetails } = useAuth();
  const currentUserId = userDetails?.user_id;

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
  try {
    setLoading(true);
    const response = await getAlerts();
    const enriched = response.data.map(item => {
      const { direction, leader_id, user_id, user_name, team_name, leader_name, created_at, team_id } = item;

      item.id = `${team_id}_${created_at}`;

      if (currentUserId === leader_id && direction === 0) {
        item.title = 'Join Request';
        item.description = `${user_name} requested to join your team ${team_name}.`;
        item.showActions = true;
      } else if (currentUserId === leader_id && direction === 1) {
        item.title = 'Request Sent';
        item.description = `You requested to join team ${team_name}.`;
      } else if (currentUserId !== leader_id && direction === 0) {
        item.title = 'Request Sent';
        item.description = `You requested to join team ${team_name}.`;
      } else if (currentUserId !== leader_id && direction === 1) {
        item.title = 'Team Invite';
        item.description = `${leader_name} invited you to join team ${team_name}.`;
        item.showActions = true;
      }

      item.time = new Date(created_at).toLocaleString();
      item.read = false;
      item.type = 'invitation'; 

      return item;
    });
    setNotifications(enriched || []);
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
  } finally {
    setLoading(false);
  }
};


  const handleNotificationPress = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleAccept = (id) => {
    console.log('Accepted:', id);
    // Add API call to accept invite
  };

  const handleReject = (id) => {
    console.log('Rejected:', id);
    // Add API call to reject invite
  };

  console.log("Alert page---curr:",currentUserId,"leader user_id")

  const getAlertIcon = (type) => {
    switch (type) {
      case 'registration':
      case 'invitation':
      case 'reminder':
      case 'update':
        return require('../../assets/bell.png');
      case 'achievement':
        return require('../../assets/Trophy.png');
      default:
        return require('../../assets/bell.png');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight, backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.title} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Alerts</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={[styles.loadingText, { color: theme.text }]}>Loading notifications...</ThemedText>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={[styles.emptyText, { color: theme.text }]}>No notifications yet</ThemedText>
            </View>
          ) : (
            notifications.map((notif, idx) => (
              <TouchableOpacity
                key={notif.id ?? `notif-${idx}`}
                onPress={() => handleNotificationPress(notif.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.notificationBox, {
                    backgroundColor: notif.read ? '#f2f2f2' : theme.cardBackground,
                    borderBottomColor: theme.secondary,
                    borderTopWidth: idx === 0 ? 1 : 0,
                    borderTopColor: theme.secondary,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }]}
                >
                  <View style={styles.iconContainer}>
                    <Image
                      source={getAlertIcon(notif.type)}
                      style={[styles.bellIcon, {
                        width: 32,
                        height: 32,
                        tintColor: notif.read ? theme.text : theme.primary
                      }]}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <ThemedText style={[styles.title, {
                      color: notif.read ? theme.text : theme.title,
                      fontWeight: notif.read ? 'normal' : 'bold'
                    }]}
                    >
                      {notif.title}
                    </ThemedText>
                    <ThemedText style={[styles.description, {
                      color: theme.text,
                      opacity: notif.read ? 0.7 : 1
                    }]}
                    >
                      {notif.description}
                    </ThemedText>
                    <ThemedText style={[styles.time, { color: '#888' }]}>{notif.time}</ThemedText>

                    {notif.showActions && (
                      <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <TouchableOpacity onPress={() => handleAccept(notif.id)} style={{ marginRight: 10, padding: 6, backgroundColor: theme.primary, borderRadius: 6 }}>
                          <ThemedText style={{ color: '#fff' }}>Accept</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReject(notif.id)} style={{ padding: 6, backgroundColor: '#ccc', borderRadius: 6 }}>
                          <ThemedText>Reject</ThemedText>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {!notif.read && (
                    <View style={[styles.unreadIndicator, { backgroundColor: theme.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Alerts


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
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'cursive',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backArrowContainer: {
    marginRight: 12,
    padding: 4,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.6,
  },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    minHeight: 100,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 4,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bellIcon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 13,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})