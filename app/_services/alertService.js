import api from '../../lib/axios';

export const getAlerts = async () => {
  try {
    const response = await api.get('invite/pending/');
    const invites = response.data.invites || [];

    const formatted = invites.map((invite, index) => ({
      id: `${invite.team_id}_${index}`,
      title: 'Team Invitation',
      description: `You have been invited to join "${invite.team_name}"`,
      time: new Date(invite.created_at).toLocaleString(),
      read: false,
      type: 'invitation',
      team_id: invite.team_id
    }));

    return { data: invites };
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return { data: [] }; // Fallback to empty list
  }
};


export const markAlertAsRead = async (alertId) => {
    try {
        const response = await api.put(`/alerts/${alertId}/read`);
        return response.data;
    } catch (error) {
        console.error('Failed to mark alert as read:', error);
        throw error;
    }
};