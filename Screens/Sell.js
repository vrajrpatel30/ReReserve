import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ImageBackground,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
// https://github.com/marlove/react-native-geocoding#readme
import Geocoder from 'react-native-geocoding';
import {Modal, Portal, Button, Provider} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
// https://unsplash.com/photos/fwWNzqif624
import AsyncStorage from '@react-native-async-storage/async-storage';
const image = {
  uri: 'https://images.unsplash.com/photo-1648146299076-ec0c5e5ead00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
};
export default function Sell({route}) {
  const navigation = useNavigation();
  // Needed data
  // Click 0:
  const [restaurant, setRestaurant] = useState();
  // Click 1:
  const [location, setLocation] = useState();
  const [coordinates, setCoordinates] = useState(route.params.coordinates);
  // Click 2:
  const [headCount, setHeadCount] = useState();
  // Click 3:
  const [price, setPrice] = useState();
  // Click 4:
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [reservationDate, setReservationDate] = useState();
  // Retrieved from local storage:
  const [name, setName] = useState();
  const [venmoID, setVenmoID] = useState();
  // Visual features
  const [isLoading, setIsLoading] = useState(true);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLocationButton, setShowLocationButton] = useState(true);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [nextClicked2, setNextClicked2] = useState(false);
  const [nextClicked3, setNextClicked3] = useState(false);
  const [nextClicked4, setNextClicked4] = useState(false);
  const [sendFlag, setSetSendFlag] = useState(false);
  const onChangeRestaurant = text => {
    setRestaurant(text);
  };
  const onChangePrice = text => {
    setPrice(text);
  };
  const onChangeLocation = text => {
    setLocation(text);
  };
  const onChangeVenmo = text => {
    setVenmoID(text);
  };
  const onChangeHeadCount = text => {
    setHeadCount(text);
  };
  // Function fires after clicking "confirm" for date time
  const onConfirmation = async text => {
    setDate(text);
    setShowModal(false);
    // Side effect of change is sending the data to backend
    setSetSendFlag(true);
  };
  const handleFirstClick = () => {
    setNextClicked(true);
    setShowLocationButton(true);
    Keyboard.dismiss();
  };
  const handleSecondClick = () => {
    if (useCurrentLocation == false) {
      fetchCoordinates();
    }
    if (nextClicked2 == true) {
      setNextClicked3(true);
    }
    setNextClicked2(true);
    setShowLocationButton(false);
    Keyboard.dismiss();
  };
  const handleThirdClick = () => {
    if (nextClicked4 == true) {
      setShowModal(true);
    }
    setNextClicked4(true);
    Keyboard.dismiss();
  };

  const fetchCoordinates = async () => {
    Geocoder.from(location)
      .then(json => {
        let temp = json.results[0].geometry.location;
        let curr_location = {
          latitude: temp.lat,
          longitude: temp.lng,
        };
        setCoordinates(curr_location);
      })
      .catch(error => console.warn(error));
  };

  const fetchAddress = async () => {
    await Geocoder.from(
      coordinates.coords.latitude,
      coordinates.coords.longitude,
    )
      .then(json => {
        let streetNum = json.results[0].address_components[0].long_name;
        let street = json.results[0].address_components[1].long_name;
        let city = json.results[0].address_components[2].long_name;
        let state = json.results[0].address_components[5].long_name;

        setLocation(streetNum + ' ' + street + ', ' + city + ', ' + state);
      })
      .catch(error => console.warn(error));
  };

  const handleSend = async () => {
    // Look up the coordinates of adress and send to DB with all other info:
    fetch('https://team13.egrep6021ad.repl.co/create/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurant: restaurant,
        time: time,
        headcount: headCount,
        adress: location,
        price: price,
        venmo_id: route.params.venmo_id,
        name: name,
        coordinates: {
          latitude: useCurrentLocation
            ? coordinates.coords.latitude
            : coordinates.latitude,
          longitude: useCurrentLocation
            ? coordinates.coords.longitude
            : coordinates.longitude,
        },
        date: moment(date).format('YYYY-MM-DD hh:mm a'),
      }),
    });

    console.log('[POST SUCCESS::]');

    setShowActivityIndicator(true);
    setTimeout(() => {
      Alert.alert("It's posted for sale!");
      navigation.navigate('Home', {
        venmo_id: route.params.venmo_id,
      });
    }, 2000);
  };
  const getLocalName = async () => {
    const local_name = await AsyncStorage.getItem(`last_name`);
    setName(local_name);
  };
  useEffect(() => {
    console.log('[RENDER::] Sell Reservation');
    if (isLoading) {
      // Restricted API key:
      Geocoder.init('AIzaSyBIsqjB7Rp5nTpVOi9RUZSVoCvtZYr1ZDk');
      getLocalName();
      setIsLoading(false);
    }
    if (sendFlag) handleSend();
    return () => {
      console.log('[UNMOUNTING::] Sell Reservation');
    };
  }, [sendFlag]);
  return (
    <ImageBackground source={image} style={styles.main}>
      {showActivityIndicator ? (
        <ActivityIndicator />
      ) : (
        <>
          <DatePicker
            modal
            // Determines if datepicker is showing:
            open={showModal}
            // Make android look like iphones default:
            androidVariant={'iosClone'}
            minuteInterval={5}
            date={startDate}
            onDateChange={curr => setDate(curr)}
            onConfirm={date => onConfirmation(date)}
            onCancel={() => {
              setShowModal(false);
            }}
          />
          {nextClicked == false ? (
            <TextInput
              style={styles.inputMain}
              value={restaurant}
              placeholder="What's the name of the restuarant? "
              placeholderTextColor={'#455A64'}
              fontSize={17}
              textAlign={'center'}
              onChangeText={text => onChangeRestaurant(text)}
            />
          ) : (
            <>
              {nextClicked2 == false ? (
                <TextInput
                  style={styles.inputMain}
                  value={location}
                  multiline={false}
                  placeholder="What is the address? "
                  placeholderTextColor={'#455A64'}
                  fontSize={15}
                  textAlign={'center'}
                  onChangeText={text => onChangeLocation(text)}
                />
              ) : (
                <>
                  {nextClicked4 == false ? (
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inputMain}
                      value={headCount}
                      placeholder="How many people? "
                      placeholderTextColor={'#455A64'}
                      fontSize={20}
                      textAlign={'center'}
                      onChangeText={text => onChangeHeadCount(text)}
                    />
                  ) : (
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inputMain}
                      value={price}
                      placeholder="How much would you like to be paid? "
                      placeholderTextColor={'#455A64'}
                      fontSize={15}
                      textAlign={'center'}
                      onChangeText={text => onChangePrice(text)}
                    />
                  )}
                </>
              )}
            </>
          )}
          {nextClicked == true && showLocationButton ? (
            <>
              <Button
                onPress={() => {
                  if (useCurrentLocation == false) {
                    fetchAddress();
                    setUseCurrentLocation(true);
                    setNextClicked2(false);
                  }
                }}>
                <Text style={{color: 'white'}}>Use current Location</Text>
              </Button>
            </>
          ) : null}

          <Button
            style={styles.sellButton}
            onPress={() => {
              nextClicked
                ? nextClicked2
                  ? handleThirdClick()
                  : handleSecondClick()
                : handleFirstClick();
            }}>
            <Text style={{color: 'black', fontWeight: '400', fontSize: 20}}>
              {'Next'}
            </Text>
          </Button>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9E3F0',
  },

  inputMain: {
    height: 50,
    width: '80%',
    marginTop: '-30%',
    borderWidth: 2,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    color: 'black',
  },

  sellButton: {
    marginTop: '15%',
    backgroundColor: '#FF8A65',
    width: Platform.OS == 'ios' ? 300 : '80%',
    height: Platform.OS == 'ios' ? 50 : null,
    display: 'flex',
    justifyContent: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    height: '95%',
    marginTop: '-30%',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 5,
  },
});
