import { Tabs } from 'expo-router'
import { StyleSheet, useColorScheme, } from 'react-native'
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import UserOnly from '../../components/Auth/UserOnly'

const siteInchargeLayout = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme] ?? Colors.light
  
  return (
    <UserOnly>
    <Tabs
      screenOptions={{
        headerShown : false,
        tabBarStyle : {
          backgroundColor : theme.cardBackground,
          paddingTop: 10,
          height : 90
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor
      }}
      >
        <Tabs.Screen 
          name='SI-Home'
          options={{
            title: "Home",
            tabBarIcon: ({focused}) => (
              <Ionicons 
                size={24}
                name={focused ? 'home' : 'home-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}/>
            )
          }}
          />

      
        
    </Tabs>
</UserOnly>
  )
}

export default siteInchargeLayout

const styles = StyleSheet.create({}) 