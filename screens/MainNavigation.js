import {createStackNavigator} from '@react-navigation/stack';
import SigninGoogle from './auth/SigninGoogle';
import Home from './auth/Home';
import {NavigationContainer} from '@react-navigation/native';
import ChatScreen from './auth/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useCallback, useEffect, useState} from 'react';
import ProfileScreen from './auth/ProfileScreen';

const Stack = createStackNavigator();
export const AuthContext = createContext();

export default function MainNavigation() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const updateUserInfo = useCallback(newData => {
    setIsUserLoggedIn(newData.islogin);
  }, []);

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('user_info');
      const isLoggedIn = storedUserInfo !== null;
      setIsUserLoggedIn(isLoggedIn);
    } catch (error) {
      console.error('Error checking user login status:', error);
    }
  };

  return (
    <AuthContext.Provider value={{islogin: isUserLoggedIn, updateUserInfo}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {isUserLoggedIn ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                  headerShown: true,
                  headerTitle: 'Profile',
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    color: '#81bfaa',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="SigninGoogle" component={SigninGoogle} />
            </>
          )}
          <Stack.Screen
            name="Chat1"
            component={ChatScreen}
            options={{
              headerShown: true,
              headerTitle: 'Chat with Meloni',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                color: '#81bfaa',
              },
            }}
            initialParams={{chatPersonId: 'meloni'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
