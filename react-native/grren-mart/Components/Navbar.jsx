import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Modal,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../utils/CartContext';

const Navbar = ({ navigation, searchQuery, setSearchQuery }) => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { cartItems } = useContext(CartContext);

  useEffect(() => {
    AsyncStorage.getItem('user').then(userData => {
      if (userData) {
        setUser(JSON.parse(userData));
      }
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setDropdownVisible(false);
    navigation.navigate('Login');
  };

  const handleNavigate = screen => {
    setDropdownVisible(false);
    navigation.navigate(screen);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery.trim() });
      setSearchQuery('');
    }
  };

  const totalCartItems = cartItems?.length || 0;

  return (
    <>
      <View style={styles.navbar}>
        {/* Logo */}
        <Text style={styles.logo}>GreenMart</Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Right section: Cart + Account/Login */}
        <View style={styles.rightSection}>
          {/* Cart icon */}
          <TouchableOpacity style={styles.cartContainer} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartText}>🛒</Text>
            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{totalCartItems}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Account dropdown or Login */}
          {user ? (
            <TouchableOpacity onPress={() => setDropdownVisible(true)}>
              <Text style={styles.accountText}>Account ▾</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginBtn}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ✅ Modal-based Dropdown (NEW) */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => handleNavigate('Profile')}>
              <Text style={styles.dropdownItem}>👤 Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Address')}>
              <Text style={styles.dropdownItem}>🏡 Address</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('MyOrders')}>
              <Text style={styles.dropdownItem}>📦 My Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Reviews')}>
              <Text style={styles.dropdownItem}>⭐ Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.dropdownItem, { color: 'red' }]}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#2b8a3e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  loginBtn: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  accountText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 10,
  },
  cartContainer: {
    marginRight: 12,
    position: 'relative',
  },
  cartText: {
    fontSize: 24,
    color: 'white',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  cartCount: {
    color: 'white',
    fontSize: 12,
  },
});

export default Navbar;
