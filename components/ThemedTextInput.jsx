import { TextInput, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

export default function ThemedTextInput({ style, ...props }) {
  const Scheme = useColorScheme()
  const theme = Colors[Scheme] ?? Colors.light

  return (
    <TextInput 
      style={[
        {
          backgroundColor: theme.background, 
          borderColor:Colors.primary,
          color: theme.title,
          padding: 10,
          borderWidth:1,
          borderRadius: 10,
        }, 
        style
      ]}
      {...props}
    />
  )
}