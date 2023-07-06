import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ImageBackground } from 'react-native';

export default function HomeScreen(props) {

    const onPressB = () => {
        console.log("Navigate to use case 1")
        props.navigation.navigate("UoA")
    }


    return (
        <ImageBackground
            style={{
                flex: 1, justifyContent: "space-between",
                alignItems: 'center',
                textAlignVertical: 'center', width: "100%"
            }}
            source={require("./assets/inteliqbg.png")}
            resizeMethod={'flex'}>
            <View style={styles.container}>
                <View style={{ top: 90 }}>
                    <View style={{ alignItems: 'center', top: -15 }}>
                        <Text adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            style={{
                                fontSize: 40,
                                fontWeight: 'bold',
                                color: '#474747',
                                top: -15
                            }}>Welcome to</Text>
                    </View>
                    <Image source={require("./assets/inteliq_logo.png")} style={{
                        width: 800,
                        height: 100,
                        margin: 50
                    }}
                        resizeMode={'contain'}
                    /></View>

                <View style={{ width: "80%", margin: 80, }}>
                    <TouchableOpacity
                        onPress={onPressB}
                        style={{

                            width: "50%",
                            margin: 4,
                            height: 50,
                            backgroundColor: "#de5d83",
                            alignItems: 'center',
                            textShadowColor: 'white',
                            borderRadius: 10,
                            paddingVertical: 3,
                            alignSelf: 'center'
                        }}>
                        <Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 5, fontSize: 24 }} adjustsFontSizeToFit={true} numberOfLines={1}>Inspect Questionnaires</Text></TouchableOpacity>

                </View>

                <View style={{ alignSelf: "flex- end", }} >
                    <Text style={styles.footernames}>Ομάδα 9</Text>
                    <View style={{ flexDirection: "row", alignContent: 'space-between', alignSelf: "center", }}> <Text style={styles.footernamess}>Μιχελάκης Π.  </Text>
                        <Text style={styles.footernamess}>Μπουσμπουκέα Γ.   </Text>
                        <Text style={styles.footernamess}>Σαμπάνης Α. </Text></View>
                    <View style={{ flexDirection: "row", alignContent: 'space-around', alignSelf: "center" }}> <Text style={styles.footernamess}>Σίσκος Κ.  </Text>
                        <Text style={styles.footernamess}>Τσέλιγκας Γ.   </Text>
                        <Text style={styles.footernamess}>Φρουδάκης Ε.  </Text></View>

                    <View style={{ margin: 10 }}></View>
                </View>
            </View>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footernames: {
        fontWeight: '500', color: '#1976d2', alignSelf: 'center', fontSize: 24
    },
    footernamess: {
        fontWeight: '500', color: '#64b5f6', alignSelf: 'center', fontSize: 24
    }
});
