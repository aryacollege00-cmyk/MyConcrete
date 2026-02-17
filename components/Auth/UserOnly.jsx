import { View, Text,ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import {React, useEffect} from 'react'
import {useAuth } from '../../app/hooks/useAuth'

const UserOnly = ({children}) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(()=>{
        if(user.authChecked && user.authenticated === false){
            router.replace('/login')
        }else if(!user.authChecked){
            return <ActivityIndicator size='large'/>
        }
    },[user.authenticated,user.authChecked])

  return children
  
}

export default UserOnly