import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const ThemedButton = ({style , ...props}) => {
  return (
    <Pressable 
        style= { ({pressed}) => [styles.btn, pressed && styles.pressed]}
        {...props}
        />

    
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn:{
    borderWidth:0,
    borderRadius:20,
    backgroundColor:'#3C8FDA',
    padding:10,
    },

    pressed:{
      opacity:0.8
    },
})