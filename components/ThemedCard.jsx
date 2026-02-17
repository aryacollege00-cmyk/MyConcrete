import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const ThemedCard = ({style, ...props}) => {
    const scheme = useColorScheme()
    const theme = Colors[scheme] ?? Colors.light

  return (
    <View 
        style={[{backgroundColor:theme.cardBackground},style.card,style]}
        {...props}/>
  )
}

export default ThemedCard

const styles = StyleSheet.create({
    card:{
        borderRadius:5,
        padding:20
    }
})