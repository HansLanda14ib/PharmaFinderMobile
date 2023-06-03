import React, {useEffect, useState} from 'react';
import {
    View, Switch, Text, TouchableOpacity, ScrollView, Modal, Linking, ActivityIndicator
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {Marker} from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY} from "./env";
import {Image} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import * as SplashScreen from 'expo-splash-screen';
import styles from './styles';


const ipAddress="172.20.10.6"
const apiUrl=`http://${ipAddress}:8081/api/v1`;


const normalIcon = require('./assets/pharmacy.png');
const onDutyIcon = require('./assets/24-hours.png');
const CurrentIcon = require('./assets/navigation.png');
const logo = require('./assets/icon.png');

const MapScreen = () => {
    const [region, setRegion] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [onDutyPharmacies, setOnDutyPharmacies] = useState([]);
    const [is24hOnDuty, setIs24hOnDuty] = useState(false);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [directions, setDirections] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [viewDirections, setViewDirections] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [pharmaModal, setPharmaModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationLoaded, setIsLocationLoaded] = useState(false);
    const [isPharmaciesLoaded, setIsPharmaciesLoaded] = useState(false);
    const [estimatedTravelTime, setEstimatedTravelTime] = useState({});
    const [locationModal, setLocationModal] = useState(false);

    const getTravelTime = async (origin, destination, pharmacyId) => {
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`;
        const resp = await fetch(apiUrl);

        if (resp.ok) {
            const data = await resp.json();
            const leg = data.routes[0]?.legs[0];
            const estimatedTime = leg ? leg.duration.text : 'Unknown';
            const estimatedDistance = leg ? leg.distance.text : 'Unknown';
            //  console.log('Estimated Time =>', estimatedTime);
            setEstimatedTravelTime(prevState => ({
                ...prevState,
                [pharmacyId]: {time: estimatedTime, distance: estimatedDistance}
            }));
        } else {
            //console.log('Error getting travel time:', resp.status);
            setEstimatedTravelTime(prevState => ({
                ...prevState,
                [pharmacyId]: null,
            }));
        }
    };
    useEffect(() => {
        const getEstimatedTravelTimes = async () => {
            if (region && currentPosition && pharmacies.length > 0) {
                const promises = pharmacies.map(async (pharmacy) => {
                    await getTravelTime(currentPosition.latitude + ',' + currentPosition.longitude, pharmacy.altitude + ',' + pharmacy.longitude, pharmacy.id);
                });
                await Promise.all(promises);
            }
        };
        getEstimatedTravelTimes();
    }, [region, currentPosition, pharmacies]);

    useEffect(() => {
        const loadLocation = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
            setCurrentPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });

            const addressList = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            if (addressList.length > 0 && addressList[0].isoCountryCode !== 'MA') {
                setLocationModal(true);
            }


            setIsLocationLoaded(true);
        };

        loadLocation();
    }, []);

    useEffect(() => {
        const loadPharmacies = async () => {
            const endpoint = is24hOnDuty ? `${apiUrl}/pharmaciesgarde/allDispoPharmacies2` : `${apiUrl}/pharmacies`;

            if (region) {
                try {
                    const res = await axios.get(endpoint);
                    setPharmacies(res.data);
                    setIsPharmaciesLoaded(true);

                    if (is24hOnDuty) {
                        setOnDutyPharmacies(res.data);
                        setIsPharmaciesLoaded(true);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };

        loadPharmacies();
    }, [region, is24hOnDuty]);

    useEffect(() => {
        if (isLocationLoaded && isPharmaciesLoaded) {
            setIsLoading(false);
            SplashScreen.hideAsync();
        }
    }, [isLocationLoaded, isPharmaciesLoaded]);

    if (isLoading) {
        return (<View style={styles.container}>
            <ActivityIndicator size="large"/>
        </View>);
    }

    const handlePharmacyPress = (pharmacy) => {
        setPharmaModal(true);
        setSelectedPharmacy(pharmacy);
        setDirections(null);
        setRegion({
            latitude: pharmacy.altitude, longitude: pharmacy.longitude, latitudeDelta: 0.015, longitudeDelta: 0.0121,
        });
    };

    const handleMapPress = () => {
        setSelectedPharmacy(null);
        setDirections(null);
    };


    const handleRegionPress = async () => {
        setRegion(currentPosition);
        setSelectedPharmacy(null);
        setDirections(null);
    };

    function handleMoreInfoPress() {
        setInfoModal(true);
    }

    function closeInfoModal() {
        setInfoModal(false);
    }


    function closePharmaModal() {
        setPharmaModal(false);
    }

    function contactDev() {
        console.log('send mail to the dev')

    }

    function isSelectedPharmacyOnDuty(selectedPharmacyId) {
        const pharmacyIdsOnDuty = onDutyPharmacies.map(pharmacy => pharmacy.id);
        //console.log(selectedPharmacyId, pharmacyIdsOnDuty);
        return pharmacyIdsOnDuty.includes(selectedPharmacyId);
    }


    return (<View style={styles.container}>
        <Modal visible={locationModal} animationType="slide" transparent={true}>

            <View style={styles.modalView}>
                <Text>The app is only available in Morocco.</Text>
                <TouchableOpacity style={styles.contactButton} onPress={() => setLocationModal(false)}>
                    <Text style={styles.contactButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>

        </Modal>

        <Modal
            visible={infoModal}
            animationType={'slide'}
            onRequestClose={closeInfoModal}
            transparent={true}
        >
            <View style={styles.modalView}>
                <View style={styles.modal2View}>
                    <TouchableOpacity onPress={closeInfoModal} style={styles.closeButton}>
                        <FontAwesome style={styles.closeButtonText} name='close'/>
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Image style={styles.logo} source={logo}/>
                        <Text style={styles.lastUpdateText}>Last update was 23 May 2023 2:05</Text>

                        <TouchableOpacity onPress={contactDev}
                                          style={styles.contactButton}>
                            <Text style={styles.contactButtonText}>Contact Dev Team</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        <MapView style={styles.map}
                 region={region}
                 provider={PROVIDER_GOOGLE}
                 onPress={handleMapPress}
        >

            {pharmacies.map(pharmacy => (<Marker
                    key={pharmacy.id}
                    title={pharmacy.name}
                    coordinate={{
                        latitude: pharmacy.altitude, longitude: pharmacy.longitude,
                    }}
                    image={onDutyPharmacies.includes(pharmacy) ? onDutyIcon : normalIcon}

                />

            ))}
            <Marker coordinate={{
                latitude: currentPosition?.latitude, longitude: currentPosition?.longitude,
            }}
                    image={CurrentIcon}/>
            {viewDirections && selectedPharmacy && (<MapViewDirections
                origin={{
                    latitude: currentPosition?.latitude, longitude: currentPosition?.longitude,
                }}
                destination={{
                    latitude: selectedPharmacy.altitude, longitude: selectedPharmacy.longitude,
                }}
                apikey={GOOGLE_API_KEY}
                strokeWidth={4}
                strokeColor="red"
                onReady={result => setDirections(result)}
            />)}

        </MapView>
        <View style={styles.switchContainer}>
            <Text style={styles.listItemTitle}>Only 24/7</Text>
            <Switch
                value={is24hOnDuty}
                onValueChange={value => setIs24hOnDuty(value)}
                thumbColor={is24hOnDuty ? 'green' : 'gray'}
                trackColor={{true: 'green', false: 'gray'}}
                accessibilityLabel={'Toggle de Garde'}
            />

        </View>
        {selectedPharmacy && (<View style={styles.switch2Container}>
            <Text style={styles.listItemTitle}>Show Directions</Text>
            <Switch
                value={viewDirections}
                onValueChange={value => setViewDirections(value)}
                thumbColor={viewDirections ? 'green' : 'gray'}
                trackColor={{true: 'green', false: 'gray'}}
                accessibilityLabel={'Toggle de Directions'}
            />
        </View>)}
        <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleRegionPress}>
                <FontAwesome name="location-arrow" size={30} color="#444"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMoreInfoPress}>
                <FontAwesome name="info" size={30} color="#444"/>
            </TouchableOpacity>
        </View>
        <View style={styles.scrollContainer}>
            <ScrollView>
                {pharmacies.map(pharmacy => (
                    <View key={pharmacy.id} style={styles.pharmacy}>
                        <TouchableOpacity onPress={() => handlePharmacyPress(pharmacy)}>
                            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                            <Text style={styles.pharmacyAddress}>Address: {pharmacy.address}</Text>
                            {region && currentPosition && (
                                <Text style={styles.pharmacyAddress}>
                                    {estimatedTravelTime[pharmacy.id] && `Duration: ${estimatedTravelTime[pharmacy.id].time}`}
                                    {'\n'}
                                    {estimatedTravelTime[pharmacy.id] && `Distance: ${estimatedTravelTime[pharmacy.id].distance}`}
                                    {!estimatedTravelTime[pharmacy.id] && 'No estimated time available'}
                                </Text>
                            )}
                            {isSelectedPharmacyOnDuty(pharmacy.id) && (
                                <Image source={onDutyIcon} style={styles.onDutyIcon}/>
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>

        <Modal visible={pharmaModal}
               animationType="slide"
               onRequestClose={closePharmaModal}
               backdropPressToClose={true}
               transparent={true}>
            <View style={styles.modal4View}>
                <View style={styles.header}>
                    <Text style={styles.pharmacy2Name}>{selectedPharmacy?.name}</Text>

                    <Text style={styles.pharmacy2DurationDistance}>
                        {estimatedTravelTime[selectedPharmacy?.id] && `${estimatedTravelTime[selectedPharmacy?.id].time}`}
                        {' - '}
                        {estimatedTravelTime[selectedPharmacy?.id] && `${estimatedTravelTime[selectedPharmacy?.id].distance}`}
                        {!estimatedTravelTime[selectedPharmacy?.id] && 'No estimated time available'}

                    </Text>

                    {isSelectedPharmacyOnDuty(selectedPharmacy?.id) && (
                        <Image source={onDutyIcon} style={styles.onDutyIconModal}/>
                    )}

                </View>

                <Text style={styles.pharmacy2Address}>Address: {selectedPharmacy?.address}</Text>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:${selectedPharmacy?.phone}`)}>
                    <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closePharmaModal}>
                    <FontAwesome style={styles.closeButtonText} name='close'/>
                </TouchableOpacity>
            </View>
        </Modal>

    </View>);

};


export default MapScreen;