import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { CartProvider } from "../utils/CartContext";

import Home from "../MainScreen/Home";
import Category from "../MainScreen/Category";
import Cart from "../MainScreen/Cart";
import ProductDetails from "../MainScreen/ProductDetails";
import Login from "../MainScreen/Login";
import RegisterScreen from "../MainScreen/Register";
import Payment from "../MainScreen/Payment";
import Profile from "../MainScreen/Profile";
import Reviews from "../MainScreen/Reviews"
import MyOrders from "../MainScreen/MyOrders"
import WriteReview from "../MainScreen/WriteReview";
import EditReview from "../MainScreen/EditReview";
import AddAddress from "../MainScreen/AddAddress.jsx";
import Address from "../MainScreen/Address.jsx";

// import ProductDetails from "./ProductDetails";
// import CartScreen from "./Cart";
// import Login from "./Login";
// import Register from "./Register";


function Launcher(){
    var Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
        <CartProvider>
            <Stack.Navigator initialRouteName="Welcome_Home">
                <Stack.Screen name="Welcome_Home" component={Home}></Stack.Screen>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="CategoryProducts" component={Category} />
                <Stack.Screen name="Product" component={ProductDetails}></Stack.Screen>
                <Stack.Screen name="Cart" component={Cart}></Stack.Screen>
                <Stack.Screen name="Payment" component={Payment}></Stack.Screen>
                <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
                <Stack.Screen name="MyOrders" component={MyOrders}></Stack.Screen>
                <Stack.Screen name="Reviews" component={Reviews}></Stack.Screen>
                <Stack.Screen name="WriteReview" component={WriteReview}></Stack.Screen>
                <Stack.Screen name="EditReview" component={EditReview}></Stack.Screen>
                <Stack.Screen name="AddAddress" component={AddAddress}></Stack.Screen>
                <Stack.Screen name="Address" component={Address}></Stack.Screen>
            </Stack.Navigator>
        </CartProvider>
        </NavigationContainer>
    )
}

export default Launcher;