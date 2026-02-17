import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Image,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { getEventById } from './_services/eventService';
import { searchUsers, searchTeams, createTeam, requestToJoinTeam } from './_services/teamService';
import ThemedText from '../components/ThemedText';
import SearchBar from '../components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';
import Spacer from '../components/Spacer'
import { useAuth } from './_hooks/useAuth';
import QRCode from 'react-native-qrcode-svg';

const RegisterEvent = () => {
  const { event_id } = useLocalSearchParams();
  const [eventData, setEventData] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiCalling, setApiCalling] = useState(false)
  const [activeTab, setActiveTab] = useState(null);

  // Create Team States
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  // Join Team States
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ visible: false, team: null, teamFull: false });
  const [teamFull, setTeamFull] = useState(false)

  //Entry tickets 
  const [showTicketSection, setShowTicketSection] = useState(false);
  const [ticketId, setTicketId] = useState(null);     //TODO: Later we need to get actual ticket Code


  const { userDetails } = useAuth()


  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

  useEffect(() => {
    fetchEventData();
  }, [event_id]);

  const showTicket = () => {
    console.log("Generating Ticket...")
    const hardcodedTicketId = 'TICKET-123456';
    setTicketId(hardcodedTicketId);
    setShowTicketSection(true);
  };

  const fetchEventData = async () => {
    try {
      const data = await getEventById(event_id);
      console.log("event data--------->", data)
      setEventData({
        title: data.event_name,
        date: new Date(data.start_time).toDateString(),
        time: new Date(data.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        venue: data.venue,
        fees: `₹${data.entry_fee}`,
        is_participant: data.is_participant,
        is_team_event: data.is_team_event,
        payment_status:  true // waiting for anup to add this to the response

      });


      console.log("event data:", data)
      console.log("team data ->",data.teams[0].members);
      // Set team data if user is a participant
      if (data.is_participant && data.team) {
        setMyTeam({
          ...data.teams[0].members,
          payment_status : true});
        console.log("my team :",data.teams);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRecommendation = async (query) => {
    return await searchUsers(query);
  };

  const handleTeamRecommendation = async (query) => {
    return await searchTeams(query, event_id);
  };

  const handleAddTeamMember = (user) => {
    if (!teamMembers.find(member => member.user_id === user.user_id)) {
      setTeamMembers([...teamMembers, { ...user, status: 'pending' }]);
    }
  };

  const handleRemoveTeamMember = (userId) => {
    setTeamMembers(teamMembers.filter(member => member.user_id !== userId));
  };

  const handleRequestToJoinTeam = (team) => {
    console.log("max:", team.max_member, " curr:", team.current_member)
    const isTeamFull = team.max_member === team.current_member;
    console.log(isTeamFull)
    setConfirmModal({ visible: true, team, teamFull: isTeamFull });
    setTeamFull(isTeamFull)

  };

  const confirmJoinRequest = async () => {
    if (!pendingRequests.find(req => req.team_id === confirmModal.team.team_id)) {
      try {
        setApiCalling(true)
        await requestToJoinTeam(confirmModal.team.team_id, userDetails.user_id);
        setPendingRequests([...pendingRequests, confirmModal.team]);
        setApiCalling(false)
        setConfirmModal({ visible: false, team: null, teamFull: false });
      } catch (error) {
        Alert.alert(error.message);
        console.log("ui error :", error.message)
        setApiCalling(false)
        setConfirmModal({ visible: false, team: null, teamFull: false });
      }
    } else {
      setConfirmModal({ visible: false, team: null, teamFull: false });
    }


  };

  const handleCancelRequest = (teamId) => {
    setPendingRequests(pendingRequests.filter(team => team.team_id !== teamId));
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    try {
      setApiCalling(true)
      const teamData = {
        team_name: teamName,
        event_id: event_id,
        members: teamMembers.map(member => member.user_id)
      };

      await createTeam(teamData);
      setApiCalling(false)
      Alert.alert('Success', 'Team created successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create team as:', error);
      setApiCalling(false)
    }
  };

  const renderUserItem = (user, onSelect) => (
    <View style={styles.recommendationItem}>
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
        style={styles.recommendationAvatar}
      />
      <ThemedText style={styles.recommendationName}>{user.username}</ThemedText>
      <TouchableOpacity style={styles.addButton} onPress={onSelect}>
        <ThemedText style={styles.addButtonText}>Add</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderTeamItem = (team, onSelect) => (
    <View style={styles.recommendationItem}>
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
        style={styles.recommendationAvatar}
      />
      <View style={styles.teamInfo}>
        <ThemedText style={styles.recommendationName}>{team.team_name}</ThemedText>
        <ThemedText style={styles.teamLeader}>Leader: {team.leader_name}</ThemedText>
        <ThemedText style={styles.teamMembers}>{team.current_member}/{team.max_member} members</ThemedText>
      </View>
      <TouchableOpacity style={styles.requestButton} onPress={onSelect}>
        <ThemedText style={styles.requestButtonText}>Request</ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (loading || !eventData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.registerBackground} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        {/* Event Details */}

        <LinearGradient
          colors={[Colors.registerSecondary, '#ffffff']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.eventDetailsContainer}
        >
          <ThemedText style={styles.eventTitle}>{eventData.title[0].toUpperCase() + eventData.title.slice(1)}</ThemedText>

          <View style={styles.eventDetailsGrid}>
            <View style={styles.eventDetailItem}>
              <Ionicons name="calendar" size={20} color={Colors.registerPrimary} />
              <ThemedText style={styles.eventDetailText}>{eventData.date}</ThemedText>
            </View>

            <View style={styles.eventDetailItem}>
              <Ionicons name="time" size={20} color={Colors.registerPrimary} />
              <ThemedText style={styles.eventDetailText}>{eventData.time}</ThemedText>
            </View>

            <View style={styles.eventDetailItem}>
              <Ionicons name="location" size={20} color={Colors.registerPrimary} />
              <ThemedText style={styles.eventDetailText}>{eventData.venue}</ThemedText>
            </View>

            <View style={styles.eventDetailItem}>
              <Ionicons name="card" size={20} color={Colors.registerPrimary} />
              <ThemedText style={styles.eventDetailText}>{eventData.fees}</ThemedText>
            </View>
          </View>
        </LinearGradient>
        {eventData.is_team_event ? (

          <>
            {/* Conditional rendering based on participation status */}
            {!eventData.is_participant ? (
              <>
                {/* Tab Buttons */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      styles.joinTabButton,
                      activeTab === 'join' && styles.activeJoinTab
                    ]}
                    onPress={() => setActiveTab('join')}
                  >
                    <Ionicons
                      name="people"
                      size={20}
                      color={activeTab === 'join' ? Colors.registerBackground : Colors.registerPrimary}
                    />
                    <ThemedText style={[
                      styles.tabText,
                      { color: activeTab === 'join' ? Colors.registerBackground : Colors.registerPrimary }
                    ]}>
                      Join a Team
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      styles.createTabButton,
                      activeTab === 'create' && styles.activeCreateTab
                    ]}
                    onPress={() => setActiveTab('create')}
                  >
                    <Ionicons
                      name="add-circle"
                      size={20}
                      color={activeTab === 'create' ? Colors.registerBackground : Colors.registerPrimary}
                    />
                    <ThemedText style={[
                      styles.tabText,
                      { color: activeTab === 'create' ? Colors.registerBackground : Colors.registerPrimary }
                    ]}>
                      Create a Team
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.myTeamContainer}>
                <ThemedText style={styles.myTeamLabel}>Your Team</ThemedText>
                {myTeam && (
                  <>
                    <ThemedText style={styles.myTeamName}>{myTeam.team_name}</ThemedText>

                    <View style={styles.teamMembersList}>
                      {myTeam.members.map((member) => (
                        <View key={member.team_member_id} style={styles.myTeamMemberItem}>
                          <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                            style={styles.myTeamMemberAvatar}
                          />
                          <ThemedText style={styles.myTeamMemberName}>{member.team_member_name}</ThemedText>
                          <View style={[
                            styles.myTeamMemberStatus,
                            { backgroundColor: member.is_confirmed ? '#02728E' : '#FFA500' }
                          ]}>
                            <ThemedText style={styles.myTeamStatusText}>
                              {member.is_confirmed ? 'Verified' : 'Pending'}
                            </ThemedText>
                          </View>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.paymentButton,
                        {
                          backgroundColor:
                            myTeam.leader_id === userDetails.user_id
                              ? myTeam.payment_status
                                ? '#02728E' // Leader after payment -> blue
                                : '#02728E' // Leader before payment -> blue (Make Payment)
                              : myTeam.payment_status
                                ? '#02728E' // Member after payment -> blue
                                : '#E0E0E0' // Member before payment -> grey
                        }
                      ]}
                      disabled={
                        myTeam.leader_id === userDetails.user_id
                          ? false // Leaders can always press (either pay or get ticket)
                          : !myTeam.payment_status // Members only press if payment done
                      }
                      onPress={() => {
                        if (myTeam.leader_id === userDetails.user_id) {
                          if (!myTeam.payment_status) {
                            // Leader, payment not done -> go to payment page
                            router.push('/Payments');
                          } else {
                            // Leader, payment done -> get entry ticket
                            showTicket()
                          }
                        } else {
                          if (myTeam.payment_status) {
                            // Member, payment done -> get entry ticket
                            showTicket()
                          }
                        }
                      }}
                    >
                      <ThemedText
                        style={[
                          styles.paymentButtonText,
                          {
                            color:
                              myTeam.leader_id === userDetails.user_id
                                ? 'white'
                                : myTeam.payment_status
                                  ? 'white'
                                  : '#999'
                          }
                        ]}
                      >
                        {myTeam.leader_id === userDetails.user_id
                          ? myTeam.payment_status
                            ? 'Get Your Entry Ticket'
                            : 'Make Payment'
                          : myTeam.payment_status
                            ? 'Get Your Entry Ticket'
                            : 'Waiting for payment completion'}
                      </ThemedText>
                    </TouchableOpacity>

                  </>
                )}
              </View>
            )}

            {/* Content based on active tab - only show if not a participant */}
            {!eventData.is_participant && (
              <>
                {activeTab === 'create' && (
                  <View style={styles.tabContent}>
                    <View style={styles.inputSection}>
                      <ThemedText style={styles.inputLabel}>Team Name</ThemedText>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter team name"
                        placeholderTextColor="#999"
                        value={teamName}
                        onChangeText={setTeamName}
                      />
                    </View>

                    <View style={styles.inputSection} >
                      <ThemedText style={styles.inputLabel}>Search Team members</ThemedText>
                      <SearchBar
                        placeholder="Enter username"
                        onRecommendation={handleUserRecommendation}
                        onSelect={handleAddTeamMember}
                        renderItem={renderUserItem}
                      />
                    </View>

                    {teamMembers.length > 0 && (
                      <View style={styles.teamSection}>
                        <ThemedText style={styles.sectionTitle}>Your Team</ThemedText>
                        {teamMembers.map((member) => (
                          <View key={member.user_id} style={styles.teamMemberItem}>
                            <Image
                              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                              style={styles.memberAvatar}
                            />
                            <ThemedText style={styles.memberName}>{member.username}</ThemedText>
                            <View style={styles.memberStatus}>
                              <ThemedText style={styles.statusText}>
                                {member.status === 'pending' ? 'Pending' : 'Verified'}
                              </ThemedText>
                            </View>
                            <TouchableOpacity
                              style={styles.removeButton}
                              onPress={() => handleRemoveTeamMember(member.user_id)}
                            >
                              <Ionicons name="close" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}

                    <TouchableOpacity style={styles.createButton} onPress={handleCreateTeam} disabled={apiCalling}>
                      {apiCalling ? <ActivityIndicator color='#ffffff' /> :
                        <ThemedText style={styles.createButtonText}>Create Team</ThemedText>
                      }
                    </TouchableOpacity>
                  </View>
                )}

                {activeTab === 'join' && (
                  <View style={styles.tabContent}>
                    <View style={styles.inputSection}>
                      <ThemedText style={styles.inputLabel}>Search Team</ThemedText>
                      <SearchBar
                        placeholder="Enter team name"
                        onRecommendation={handleTeamRecommendation}
                        onSelect={handleRequestToJoinTeam}
                        renderItem={renderTeamItem}
                      />
                    </View>

                    {pendingRequests.length > 0 && (
                      <View style={styles.pendingSection}>
                        <ThemedText style={styles.sectionTitle}>Pending Team requests</ThemedText>
                        {pendingRequests.map((team) => (
                          <View key={team.team_id} style={styles.pendingRequestItem}>
                            <Image
                              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                              style={styles.memberAvatar}
                            />
                            <View style={styles.pendingTeamInfo}>
                              <ThemedText style={styles.pendingTeamName}>{team.team_name}</ThemedText>
                              <ThemedText style={styles.pendingTeamLeader}>{team.leader_name}</ThemedText>
                              <ThemedText style={styles.pendingTeamMembers}>
                                {team.current_member}/{team.max_member}
                              </ThemedText>
                            </View>
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={() => handleCancelRequest(team.team_id)}
                            >
                              <Ionicons name="close" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.waitingSection}>
                      <ThemedText style={styles.waitingText}>Please wait for approval</ThemedText>
                    </View>
                  </View>
                )}
              </>
            )}
          </>
        ) : (
          // NON-TEAM EVENT FLOW
          <View style={{ marginTop: 20 }}>
            {eventData.is_participant ? (
              <TouchableOpacity
                style={[
                  styles.paymentButton,
                  { backgroundColor: eventData.payment_status ? '#02728E' : '#02728E' }
                ]}
                onPress={() => {
                  if (!eventData.payment_status) {
                    router.push('/Payments');
                  } else {
                    showTicket()
                  }
                }}
              >
                <ThemedText style={[styles.paymentButtonText, { color: 'white' }]}>
                  {eventData.payment_status ? 'Get Your Entry Ticket' : `Pay & Register Now (${eventData.fees})`}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.paymentButton, { backgroundColor: '#02728E' }]}
                onPress={() => router.push('/Payments')}
              >
                <ThemedText style={[styles.paymentButtonText, { color: 'white' }]}>
                  Pay Now ({eventData.fees})
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}

        {showTicketSection && (
          <View style={[{ alignItems: 'center', marginTop: 20, marginBottom:40, backgroundColor:'#ffffff' }, styles.myTeamContainer]}>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Entry Ticket
            </ThemedText>
            <QRCode
              value={ticketId || '123'}
              size={200}
            />
          </View>
        )}


      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmModal({ visible: false, team: null, teamFull: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Join Team Request</ThemedText>
            {confirmModal.team && (
              <View style={styles.modalTeamInfo}>
                <ThemedText style={styles.modalTeamName}>
                  Team: {confirmModal.team.team_name}
                </ThemedText>
                <ThemedText style={styles.modalTeamLeader}>
                  Leader: {confirmModal.team.leader_name}
                </ThemedText>
                <ThemedText style={styles.modalTeamMembers}>
                  Members: {confirmModal.team.current_member}/{confirmModal.team.max_member}
                </ThemedText>
              </View>
            )}
            <ThemedText style={styles.modalSubtitle}>
              Are you sure you want to send a join request to this team?
            </ThemedText>
            {teamFull &&
              <View style={styles.warning}>
                <Ionicons name="warning-outline" size={24} color="#333" />
                <ThemedText style={styles.modalSubtitle}>
                  Team Already full
                </ThemedText>
              </View>
            }

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setConfirmModal({ visible: false, team: null, teamFull: false })}
              >
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmJoinRequest}>
                {apiCalling ? <ActivityIndicator color='#ffffff' /> :
                  <ThemedText style={styles.modalConfirmText}>Confirm</ThemedText>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.registerBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventDetailsContainer: {
    marginBottom: 40,
    borderRadius: 20,
    padding: 24,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.registerPrimary,
    marginBottom: 16,
  },
  eventDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    padding: 5
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap'
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: -60,
    marginBottom: 24,
    gap: 12,
    zIndex: 1
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  joinTabButton: {
    borderColor: Colors.registerPrimary,
    backgroundColor: Colors.registerBackground,
  },
  createTabButton: {
    borderColor: Colors.registerPrimary,
    backgroundColor: Colors.registerBackground,
  },
  activeJoinTab: {
    backgroundColor: Colors.registerPrimary,
  },
  activeCreateTab: {
    backgroundColor: Colors.registerPrimary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabContent: {
    marginBottom: 100,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recommendationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  recommendationName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  teamInfo: {
    flex: 1,
  },
  teamLeader: {
    fontSize: 14,
    color: '#666',
  },
  teamMembers: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    backgroundColor: Colors.registerPrimary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.registerBackground,
    fontSize: 14,
    fontWeight: '600',
  },
  requestButton: {
    backgroundColor: Colors.registerPrimary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  requestButtonText: {
    color: Colors.registerBackground,
    fontSize: 14,
    fontWeight: '600',
  },
  teamSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.registerPrimary,
    marginBottom: 16,
  },
  teamMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.registerSecondary,
    borderRadius: 12,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  memberStatus: {
    backgroundColor: Colors.registerPrimary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  statusText: {
    color: Colors.registerBackground,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  createButton: {
    backgroundColor: Colors.registerPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,

  },
  createButtonText: {
    color: Colors.registerBackground,
    fontSize: 18,
    fontWeight: '600',
  },
  pendingSection: {
    marginBottom: 24,
  },
  pendingRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.registerSecondary,
    borderRadius: 12,
    marginBottom: 8,
  },
  pendingTeamInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pendingTeamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pendingTeamLeader: {
    fontSize: 14,
    color: '#666',
  },
  pendingTeamMembers: {
    fontSize: 12,
    color: Colors.registerPrimary,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 4,
  },
  waitingSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: Colors.registerSecondary,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  waitingText: {
    fontSize: 16,
    color: Colors.registerPrimary,
    fontWeight: '600',
  },
  myTeamContainer: {
    // marginTop: -30,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  myTeamLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02728E',
    marginBottom: 8,
  },
  myTeamName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  teamMembersList: {
    marginBottom: 24,
  },
  myTeamMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myTeamMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  myTeamMemberName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  myTeamMemberStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  myTeamStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.registerBackground,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.registerPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTeamInfo: {
    marginBottom: 16,
  },
  modalTeamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalTeamLeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalTeamMembers: {
    fontSize: 14,
    color: Colors.registerPrimary,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.registerPrimary,
    alignItems: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.registerPrimary,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.registerPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmText: {
    color: Colors.registerBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  warning: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default RegisterEvent;