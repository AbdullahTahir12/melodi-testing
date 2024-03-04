import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);

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

  const handleProfilePress = () => {
    // Navigate to SigninGoogle screen or any other screen as needed
    navigation.navigate('ProfileScreen');
  };

  return (
    <View style={styles.container}>
      <Text>Enjoy with your fav person!</Text>

      {/* TouchableOpacity for Chat 1 with pink color */}
      <TouchableOpacity
        style={[styles.button, styles.buttonPink]}
        onPress={() => navigation.navigate('Chat1')}>
        <Text style={styles.buttonText}>Meloni</Text>
      </TouchableOpacity>

      {/* Profile button in header */}
      {userInfo && (
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}>
          <Image
            source={{uri: userInfo.user.photo}}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      )}

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonPink: {
    backgroundColor: 'pink',
  },
  profileButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Home;
