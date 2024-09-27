import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image} from 'react-native';
import { auth, db } from '../components/firebase'; 
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Loading from '../assets/loading-gif-icon-24.jpg';

const Account = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userDoc = doc(db, 'users', userId);
          const docSnap = await getDoc(userDoc);
          
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
          } else {
            Alert.alert('Error', 'User data not found.');
          }
        } else {
          Alert.alert('Error', 'No user is currently authenticated.');
        }
      } catch (error) {
        Alert.alert('Error fetching user info', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); 
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const userId = auth.currentUser.uid;
    try {
      await deleteDoc(doc(db, 'users', userId));
      await auth.currentUser.delete();
      Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return <View><Image source={Loading} style={styles.loadingImage} /></View>

    
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.card}>
          <Text style={styles.heading}>User Information</Text>
          <Text style={styles.info}>First Name: {userInfo.firstName}</Text>
          <Text style={styles.info}>Last Name: {userInfo.lastName}</Text>
          <Text style={styles.info}>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <Text>No user information available.</Text>
      )}
      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.delete} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e5eff1',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: 'grey', 
    shadowOpacity: 0.5,
    marginBottom: 20,
  },
  loadingImage: {
    width: 400, 
    height: 400, 
    marginBottom: 10,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24, 
    marginBottom: 20,
  },
  info: {
    marginBottom: 12,
    fontSize: 18,
  },
  signOut: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  delete: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Account;
