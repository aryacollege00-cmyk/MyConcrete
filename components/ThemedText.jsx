import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';

const ThemedText = ({style, title=false, ...props}) => {
    const scheme = useColorScheme();
    const theme = Colors[scheme] ?? Colors.light;
    const textColor =  title ? theme.title : theme.text
    const Weight = title ? 800 : 400
  return (
      <Text
        style={
            [{color:textColor,fontWeight:Weight},style]
        }
        {...props}
      />
  )
}

export default ThemedText

const styles = StyleSheet.create({})