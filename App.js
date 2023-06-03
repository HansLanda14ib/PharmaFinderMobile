import {createStackNavigator} from '@react-navigation/stack';
import MapScreen from "./MapScreen";
import {NavigationContainer} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from "react";

const Stack = createStackNavigator();
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Find Pharmacies near you" component={MapScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
