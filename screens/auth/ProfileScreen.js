import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AuthContext} from '../MainNavigation';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const {updateUserInfo} = useContext(AuthContext);

  const [crushName, setCrushName] = useState('');
  const [crushImage, setCrushImage] = useState(null);

  useEffect(() => {
    const getStoredUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('user_info');
        if (storedUserInfo !== null) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
          setCrushName(parsedUserInfo.crushName || ''); // Set crush name (default to empty string if not found)
          setCrushImage(parsedUserInfo.crushImage || null);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getStoredUserData();
  }, []);

  const openImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else if (response.assets && response.assets.length > 0) {
        // Access the first asset's URI
        const imageUri = response.assets[0].uri;
        console.log('Image URI: ', imageUri);
        // Save or process the image URI as needed
        setCrushImage(imageUri);
      } else {
        console.log('Unknown error');
      }
    });
  };

  const saveCrushInfo = async () => {
    try {
      // Assuming you have already stored user_info in AsyncStorage
      const storedUserInfo = await AsyncStorage.getItem('user_info');
      if (storedUserInfo !== null) {
        const parsedUserInfo = JSON.parse(storedUserInfo);

        const updatedUserInfo = {
          ...parsedUserInfo,
          crushName: crushName,
          crushImage: crushImage,
        };

        await AsyncStorage.setItem(
          'user_info',
          JSON.stringify(updatedUserInfo),
        );
        setUserInfo(updatedUserInfo);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error saving crush info:', error);
    }
  };

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
      {userInfo != null && <Text style={styles.txt}>{userInfo.user.name}</Text>}
      {userInfo != null && (
        <Text style={styles.txt}>{userInfo.user.email}</Text>
      )}
      {userInfo != null && (
        <Image
          source={{uri: userInfo.user.photo}}
          style={{width: 100, height: 100, borderRadius: 50, marginTop: 10}}
        />
      )}

      <View style={styles.separator} />

      <Text style={styles.txt}>Crush Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Crush Name"
        value={crushName}
        onChangeText={text => setCrushName(text)}
      />
      <Text style={styles.txt}>Crush Image:</Text>
      {crushImage && (
        <Image
          source={{uri: crushImage}}
          style={{width: 100, height: 100, borderRadius: 50, marginTop: 10}}
        />
      )}

      <TouchableOpacity onPress={openImagePicker}>
        <View style={styles.signoutbtn}>
          <FontAwesome name="camera" size={20} color="white" />
          <Text style={styles.signouttxt}>Pick Crush Image</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={saveCrushInfo}>
        <View style={styles.signoutbtn}>
          <MaterialCommunityIcons
            name="content-save-move"
            size={20}
            color="white"
          />
          <Text style={styles.signouttxt}>Save Crush Info</Text>
        </View>
      </TouchableOpacity>

      {userInfo != null && (
        <TouchableOpacity onPress={() => signOut()}>
          <View style={styles.signoutbtn}>
            <FontAwesome5 name="save" size={20} color="white" />
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
    backgroundColor: '#81bfaa', // Green color for example
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  signouttxt: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgrey', // Customize the color as needed
    marginVertical: 20, // Add margin for spacing
    width: '100%',
  },
  txt: {
    marginLeft: 10,
    margin: 5,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#81bfaa',
    padding: 5,
    borderWidth: 2,
    marginTop: 10,
    borderRadius: 10,
    width: '70%',
  },
});
