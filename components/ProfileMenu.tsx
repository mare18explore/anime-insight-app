import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

// Define the screens in your navigation stack
type RootStackParamList = {
  Login: undefined;
  // add more screens if needed later
};


const ProfileMenu: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // Handles logging out and going back to the login screen
  const handleLogout = () => {
  setModalVisible(false);
  router.replace('/authentifcation/login');
};

  return (
    <View style={styles.container}>
      {/* When you tap this profile picture, it opens the logout modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={{ alignItems: 'center' }}>
            <Text style={styles.label}>Profile</Text>
            <Image
            source={require('../assets/images/blankProfilePicture.png')}
            style={styles.avatar}
            />
        </View>
      </TouchableOpacity>

      {/* Logout Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Clicking outside the box closes the modal */}
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.menu}>
            <Pressable onPress={handleLogout}>
              <Text style={styles.menuItem}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ProfileMenu;

// Styles for the profile picture and logout modal
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#444',
	},
});