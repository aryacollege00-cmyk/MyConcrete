import { createContext, useState, useEffect } from "react";
import { registerAccount, loginAccount, getUserById } from '../services/authService';
import api from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    token: null,
    authenticated: false,
    authChecked: false,
    details: null,
  });

  useEffect(() => {
    loadTokenAndUser();
  }, []);

  const loadTokenAndUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("JWT_TOKEN");
      const storedUserId = await SecureStore.getItemAsync("USER_ID");

      let userProfileImage = null;
      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);
        userProfileImage = avatar.source || null;
      }

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        let userDetails = null;
        if (storedUserId) {
          const resp = await getUserById(storedUserId);
          userDetails = resp?.data || null;
          if (userDetails && userProfileImage) {
            userDetails.profile_image = userProfileImage;
          }
        }

        setUser({
          token,
          authenticated: true,
          authChecked: true,
          details: userDetails,
        });
      } else {
        setUser({
          token: null,
          authenticated: false,
          authChecked: true,
          details: null,
        });
      }
    } catch (err) {
      console.error("Error loading token or user:", err);
      setUser({
        token: null,
        authenticated: false,
        authChecked: true,
        details: null,
      });
    }
  };

  async function login(email, password) {
    try {
      const resp = await loginAccount({ email_id: email, password });
      const { token, user_id } = resp.data.data;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync("JWT_TOKEN", token);
      await SecureStore.setItemAsync("USER_ID", user_id.toString());

      let userDetailsResp = await getUserById(user_id);
      let userDetails = userDetailsResp?.data || null;

      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);
        userDetails.profile_image = avatar.source || null;
      }

      setUser({
        token,
        authenticated: true,
        authChecked: true,
        details: userDetails,
      });

      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync("JWT_TOKEN");
    await SecureStore.deleteItemAsync("USER_ID");
    api.defaults.headers.common["Authorization"] = "";

    setUser({
      token: null,
      authenticated: false,
      authChecked: true,
      details: null,
    });
  }

  async function register({ username, email_id, password }) {
    try {
      const resp = await registerAccount({ email_id, password });
      console.log(resp);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        userDetails: user.details,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
