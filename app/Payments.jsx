import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

const Payments = () => {

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Maintenance-bro.png')} // Replace this with your own image URL
        style={styles.illustration}
      />
      <Text style={styles.text}>Payment Gateway</Text>
      <Text style={styles.text}>Under Development</Text>
            <Pressable style={styles.button} onPress={()=> router.back()}>
              <Text style={[styles.text, {color:'#fff'}]}>Go Back</Text>
            </Pressable>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button:{
    margin: 10,
    padding:10,
    backgroundColor: Colors.primary,
    borderRadius: 10
  }
});
