import api from '../../lib/axios';

export const getEvents = async () => {
    try {
        const resp = await api.get('/events/');
        return resp.data;
    } catch (error) {
        throw error;
    }
};

export const getEventById = async (event_id) => {
  try {
    const resp = await api.get(`/events/${event_id}`, { params: { event_id } });
    console.log("api response of eventbyID:",resp)
    return resp.data.data;
  } catch (error) {
    throw error;
  }
};

export const getEventByUserId = async (user_id) => {
  try {
    const resp = await api.get(`/events/user/${user_id}`, { params: { user_id } });
    return resp.data.data;
  } catch (error) {
    throw error;
  }
};