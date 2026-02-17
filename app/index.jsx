import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import api from '../lib/axios'
import { testApi } from './services/authService'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

// MyConcrete Logo Component
const MyConcreteLogoSVG = ({ width = 200, height = 120 }) => (
  <Svg width={width} height={height} viewBox="0 0 400 240">
    <Defs>
      <LinearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#4A5FCF" />
        <Stop offset="100%" stopColor="#1F388B" />
      </LinearGradient>
      <LinearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF4444" />
        <Stop offset="100%" stopColor="#CC2222" />
      </LinearGradient>
    </Defs>

    {/* First M */}
    <Path
      d="M20 200 L20 60 L60 200 L100 60 L100 200 L80 200 L80 120 L60 200 L40 200 L40 120 L40 200 Z"
      fill="url(#blueGradient)"
    />

    {/* Second M */}
    <Path
      d="M120 200 L120 60 L160 200 L200 60 L200 200 L180 200 L180 120 L160 200 L140 200 L140 120 L140 200 Z"
      fill="url(#blueGradient)"
    />

    {/* C */}
    <Path
      d="M220 60 C280 60 320 100 320 130 C320 160 280 200 220 200 C180 200 140 160 140 130 L160 130 C160 150 185 180 220 180 C255 180 300 150 300 130 C300 110 255 80 220 80 C185 80 160 110 160 130 L140 130 C140 100 180 60 220 60 Z"
      fill="url(#redGradient)"
    />

    {/* Blue bottom part of C */}
    <Path
      d="M220 140 C255 140 300 150 300 130 C300 150 280 200 220 200 C180 200 140 160 140 130 C140 160 180 200 220 200 C255 170 300 150 300 130 C300 150 255 140 220 140 Z"
      fill="url(#blueGradient)"
    />
  </Svg>
);

const Home = () => {
  const { user } = useAuth();

  useEffect(()=>{
    console.log("testing api ")
    try{
      const resp = testApi();

    }catch(error){
      console.log("error caught in index")
    }

  })

  const handleGetStarted = () => {
    if (user?.authenticated) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
      </View>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <MyConcreteLogoSVG width={250} height={150} />
        <Text style={styles.appName}>MyConcrete</Text>
        <Text style={styles.tagline}>Your Concrete Management Solution</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Streamline your concrete operations with our comprehensive management platform
        </Text>
      </View>

      {/* Get Started Button */}
      <Pressable style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedText}>Get Started</Text>
      </Pressable>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 MyConcrete. All rights reserved.</Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F388B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#FFCC00',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  getStartedButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 40,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getStartedText: {
    color: '#1F388B',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.7,
  },
});