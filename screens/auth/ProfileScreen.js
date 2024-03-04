import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AuthContext} from '../MainNavigation';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const {updateUserInfo} = useContext(AuthContext);
  useEffect(() => {
    const getStoredUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('user_info');
        if (storedUserInfo !== null) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getStoredUserData();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      await AsyncStorage.removeItem('user_info');
      updateUserInfo({islogin: false});
      navigation.replace('SigninGoogle');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {userInfo != null && <Text>{userInfo.user.name}</Text>}
      {userInfo != null && <Text>{userInfo.user.email}</Text>}
      {userInfo != null && (
        <Image
          source={{uri: userInfo.user.photo}}
          style={{width: 100, height: 100}}
        />
      )}
      {userInfo != null && (
        <TouchableOpacity onPress={() => signOut()}>
          <View style={styles.signoutbtn}>
            <SimpleLineIcons name="logout" size={20} color="white" />
            <Text style={styles.signouttxt}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  signoutbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Green color for example
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3, // Shadow for Android
    shadowColor: 'black', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
    marginTop: 20,
  },
  signouttxt: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
