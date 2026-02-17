import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../constants/Colors'

import { useAuth } from '../hooks/useAuth'
import GuestOnly  from '../../components/Auth/GuestOnly'

const AuthLayout = () => {

    const { user } = useAuth()
    console.log(user)

    const Scheme = useColorScheme()
    const theme = Colors[Scheme] ?? Colors.light
  return (
    <GuestOnly>
    <StatusBar value='auto'/>
    <Stack screenOptions={{
        headerStyle:{backgroundColor:theme.background},
        headerTintColor: theme.text
    }}>
        <Stack.Screen name='login' options={{headerShown : false}}/>
        <Stack.Screen name='register' options={{headerShown : false}}/>
        <Stack.Screen name='verify' options={{headerShown : false}}/>
        <Stack.Screen name='basicProfileCompletion' options={{headerShown : false}}/>
    </Stack>
  </GuestOnly>
  )
}

export default AuthLayout
