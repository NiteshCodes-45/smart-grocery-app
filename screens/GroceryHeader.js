import { View, Text, StyleSheet, Image } from "react-native";

function GroceryHeader(){
    return(
        <View style={styles.headerContainer}>
            <Image style={styles.logoImage} source={require('../assets/images/GroceryAppLogo.jpg')} />
            <View>
                <Text style={styles.brandName}>Smart Grocery</Text>
                <Text style={styles.brandTitle}>Manage groceries effortlessly</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer:{
        marginTop:15,
        flexDirection:"row",
        gap:10,
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:20,
        borderWidth:1,
        borderRadius:10,
        padding:20,
        backgroundColor:'#8dcf76ff',
        borderColor:'#7be256ff',
        elevation:20
    },
    logoImage:{
        width:55,
        height:55,
        borderRadius:50
    },
    brandName:{
        fontSize:20,
        fontWeight:'bold',
        color:'#302a2aff'
    },
    brandTitle:{
        color:'#585555ff'
    },
});
export default GroceryHeader;