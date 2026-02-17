import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useAuth } from '../../app/_hooks/useAuth'

const GuestOnly = ({children}) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user.authChecked && user.authenticated === true) {
            router.replace('/home')
        }
    }, [router, user.authenticated, user.authChecked])

    if (!user.authChecked) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      )
    }

  return children
}

export default GuestOnly
