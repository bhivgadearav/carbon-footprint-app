import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light';
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "black", 
      tabBarInactiveTintColor: "black",
      tabBarStyle: { 
      backgroundColor: "#ffff",
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      paddingHorizontal: 10,
      paddingVertical: 150,
      },
      headerShown: false 
    }}>
      <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={"black"} />,
      }}
      />
      <Tabs.Screen
      name="explore"
      options={{
        title: 'Explore',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="globe" color={"black"} />,
      }}
      />
      <Tabs.Screen
      name="account"
      options={{
        title: 'Account',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={"black"} />,
      }}
      />
    </Tabs>
  );
}