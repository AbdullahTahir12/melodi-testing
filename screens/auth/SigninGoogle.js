import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../MainNavigation';

const SigninGoogle = () => {
  const navigation = useNavigation();
  const {updateUserInfo} = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  const saveUserDataToStorage = async userInfo => {
    try {
      await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const getStoredUserData = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('user_info');
      if (storedUserInfo !== null) {
        // There is user data stored, you can handle it as needed
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '198536869914-if2k63fas29u8qpgqk1c110j1idbvpo7.apps.googleusercontent.com',
    });
    getStoredUserData();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const usrInfo = await GoogleSignin.signIn();
      setUserInfo(usrInfo);
      saveUserDataToStorage(usrInfo);
      updateUserInfo({islogin: true});
      // setTimeout(() => navigation.navigate('Home'), 2000);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => signIn()}>
        <View style={styles.signinbtn}>
          <Icon name="google" size={20} color="white" />
          <Text style={styles.signintxt}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SigninGoogle;

const styles = StyleSheet.create({
  signinbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DB4437', // Google red color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3, // Shadow for Android
    shadowColor: 'black', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  signintxt: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
