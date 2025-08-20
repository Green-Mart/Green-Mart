import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Navbar from '../Components/Navbar';
import AddToCartControl from "../Components/AddToControl";
import { getProductsByCategory } from "../api/productApi";
import { useCart } from "../utils/CartContext";
import { Image_URL } from "../utils/Base_Url";

const Home = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fruits, setFruits] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [dairy, setDairy] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();

  const fetchAllProducts = async () => {
    try {
        // debugger
      setLoading(true);
      const [fruitsRes, vegetablesRes, dairyRes] = await Promise.all([
        getProductsByCategory("fruit"),
        getProductsByCategory("vegetables"),
        getProductsByCategory("dairy")
      ]);
      setFruits(fruitsRes.data);
      setVegetables(vegetablesRes.data);
      setDairy(dairyRes.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Apply search filter
  const filteredFruits = fruits.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredVegetables = vegetables.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredDairy = dairy.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <ActivityIndicator size="large" color="#2b8a3e" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {/* No products */}
          {filteredFruits.length === 0 && filteredVegetables.length === 0 && filteredDairy.length === 0 && (
            <Text style={styles.noResultsText}>No products found</Text>
          )}

          {/* Fruits */}
          {filteredFruits.length > 0 && (
            
            <>
              <Text style={styles.categoryTitle}>🍎 Fruits</Text>
              <View style={styles.rowWithArrow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredFruits.map(product => {
                  const cartItem = cartItems.find(item => item.productId === product.productId);
                  const quantity = cartItem?.cartItemQuantity || 0;
                  console.log(`${Image_URL}/uploads/${product.productImageUrl}`);
                  return(
                  <View key={`fruit-${product.productId}-${quantity}`} style={styles.card}>
                    {/* Navigate to Product Details when pressing image or name */}
                    <TouchableOpacity onPress={() => navigation.navigate('Product', { productId: product.productId })}>
                      <Image source={{uri: `${Image_URL}/uploads/${product.productImageUrl}`}} style={styles.image} />
                      <Text style={styles.productName}>{product.productName}</Text>
                      <Text style={styles.price}>₹{product.productPrice}</Text>
                    </TouchableOpacity>

                    {/* Keep AddToCartControl outside TouchableOpacity */}
                    <View style={styles.button}>
                      <AddToCartControl productId={product.productId} />
                    </View>
                  </View>
                )})}
              </ScrollView>
              <TouchableOpacity
                    style={styles.arrowButton}
                     onPress={() => navigation.navigate('CategoryProducts', { category: 'fruit' })}>
                <Text style={styles.arrowText}>➔</Text>
                </TouchableOpacity>
                </View>
            </>
          )}

          {/* Vegetables */}
          {filteredVegetables.length > 0 && (
            <>
              <Text style={styles.categoryTitle}>🥦 Vegetables</Text>
              <View style={styles.rowWithArrow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredVegetables.map(product => {
                  const cartItem = cartItems.find(item => item.productId === product.productId);
                  const quantity = cartItem?.cartItemQuantity || 0;
                  return(
                <View key={`veg-${product.productId}-${quantity}`} style={styles.card}>
                {/* Navigate to Product Details when pressing image or name */}
                <TouchableOpacity onPress={() => navigation.navigate('Product', { productId: product.productId })}>
                  <Image source={{uri: `${Image_URL}/uploads/${product.productImageUrl}`}} style={styles.image} />
                  <Text style={styles.productName}>{product.productName}</Text>
                  <Text style={styles.price}>₹{product.productPrice}</Text>
                </TouchableOpacity>

                {/* Keep AddToCartControl outside TouchableOpacity */}
                <View style={styles.button}>
                  <AddToCartControl productId={product.productId} />
                </View>
              </View>
                )})}
              </ScrollView>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => navigation.navigate('CategoryProducts', { category: 'vegetables' })} >
                <Text style={styles.arrowText}>➔</Text>
                </TouchableOpacity>
                </View>
            </>
          )}

          {/* Dairy */}
          {filteredDairy.length > 0 && (
            <>
              <Text style={styles.categoryTitle}>🥛 Dairy Products</Text>
              <View style={styles.rowWithArrow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredDairy.map(product => {
                  const cartItem = cartItems.find(item => item.productId === product.productId);
                  const quantity = cartItem?.cartItemQuantity || 0;
                  return(
                  <View key={`dairy-${product.productId}-${quantity}`} style={styles.card}>
                  {/* Navigate to Product Details when pressing image or name */}
                  <TouchableOpacity onPress={() => navigation.navigate('Product', { productId: product.productId })}>
                    <Image source={{uri: `${Image_URL}/uploads/${product.productImageUrl}`}} style={styles.image} />
                    <Text style={styles.productName}>{product.productName}</Text>
                    <Text style={styles.price}>₹{product.productPrice}</Text>
                  </TouchableOpacity>

                  {/* Keep AddToCartControl outside TouchableOpacity */}
                  <View style={styles.button}>
                    <AddToCartControl productId={product.productId} />
                  </View>
                </View>
                )})}
              </ScrollView>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => navigation.navigate('CategoryProducts', { category: 'dairy' })}>
                <Text style={styles.arrowText}>➔</Text>
            </TouchableOpacity>
            </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    marginLeft: 8,
  },
  card: {
    width: 140,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  productName: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  price: {
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    marginTop: 6,
    backgroundColor: '#2b8a3e',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 16,
  },
  rowWithArrow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  },
  arrowButton: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 10,
},
arrowText: {
  fontSize: 24,
  color: '#2b8a3e',
},

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Home;
