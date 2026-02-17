import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SIHome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Site Incharge Home</Text>
    </View>
  )
}

export default SIHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
})
