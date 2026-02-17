import api from '../../lib/axios';

export const searchUsers = async (query) => {
  try {
    const response = await api.get('/user/search-users', {
      params: { username: query, limit: 5 }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    // Return mock data for development
    return [
      { user_id: 1, username: 'john_doe' },
      { user_id: 2, username: 'jane_smith' },
      { user_id: 3, username: 'mike_wilson' },
    ].filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
  }
};

export const searchTeams = async (query, eventId) => {
  try {
    const response = await api.get('/teams/search-teams', {
      params: { team_name: query,event_id:eventId, limit: 5 }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching teams:', error);
    // Return mock data for development
    return [
      { 
        team_id: 1, 
        team_name: 'Royal Challengers', 
        leader_id: 1, 
        leader_name: 'Rajkumar', 
        max_members: 5, 
        current_members: 3 
      },
      { 
        team_id: 2, 
        team_name: 'Chennai SK', 
        leader_id: 2, 
        leader_name: 'Arun Kumar', 
        max_members: 4, 
        current_members: 2 
      },
    ].filter(team => team.team_name.toLowerCase().includes(query.toLowerCase()));
  }
};

export const createTeam = async (teamData) => {
  try {
    const response = await api.post('/participants/register', teamData);
    return response.data;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const requestToJoinTeam = async (teamId, userID) => {
  try {
    const response = await api.post('/teams/join', { team_id: teamId, user_id: userID});
    return response.data;
  } catch (error) {
    if (error.status == 400){
      console.error('Error requesting to join team:', error.status);
      throw Error('Request already sent to this team, Please wait for leader to accept it');
    }
  }
};