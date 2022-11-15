import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
// https://github.com/marlove/react-native-geocoding#readme
import Geocoder from 'react-native-geocoding';

export default function Sell() {
  const navigation = useNavigation();
  const [restaurant, setRestaurant] = useState();
  const [headCount, setHeadCount] = useState();
  const [price, setPrice] = useState();
  const [location, setLocation] = useState();
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  const [venmoID, setVenmoID] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const onChangeRestaurant = text => {
    setRestaurant(text);
  };
  const onChangePrice = text => {
    setPrice(text);
  };
  const onChangeLocation = text => {
    setLocation(text);
  };
  const onChangeTime = text => {
    setTime(text);
  };
  const onChangeDate = text => {
    setDate(text);
  };
  const onChangeVenmo = text => {
    setVenmoID(text);
  };
  const onChangeHeadCount = text => {
    setHeadCount(text);
  };

  const handleSend = async () => {
    // Look up the coordinates of adress and send to DB with all other info:
    Geocoder.from(location)
      .then(json => {
        let temp = json.results[0].geometry.location;
        let curr_location = {
          latitude: temp.lat,
          longitude: temp.lng,
        };
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
            venmo_id: venmoID,
            coordinates: curr_location,
            date: date,
          }),
        });
      })
      .catch(error => console.warn(error));

    console.log('Complete POST');
    setRestaurant(null);
    setTime(null);
    setHeadCount(null);
    setLocation(null);
    setPrice(null);
    setVenmoID(null);
    setDate(null);
    Alert.alert("It's posted for sale!");
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (isLoading) {
      // Restricted API key:
      Geocoder.init('AIzaSyBIsqjB7Rp5nTpVOi9RUZSVoCvtZYr1ZDk');
      setIsLoading(false);
    }
  }, [restaurant, location]);
  return (
    <View style={styles.main}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={restaurant}
          placeholder="Restaurant? "
          placeholderTextColor={'#455A64'}
          onChangeText={text => onChangeRestaurant(text)}
        />
        <TextInput
          style={styles.input}
          value={time}
          placeholder="Date of reservation?"
          placeholderTextColor={'#455A64'}
          keyboardType="numeric"
          onChangeText={text => onChangeDate(text)}
        />
        <TextInput
          style={styles.input}
          value={time}
          placeholder="Time of reservation?"
          placeholderTextColor={'#455A64'}
          keyboardType="numeric"
          onChangeText={text => onChangeTime(text)}
        />
        <TextInput
          style={styles.input}
          value={headCount}
          placeholder="How many seats?"
          placeholderTextColor={'#455A64'}
          keyboardType="numeric"
          onChangeText={text => onChangeHeadCount(text)}
        />
        <TextInput
          style={styles.input}
          value={location}
          placeholder="What is the adress? "
          placeholderTextColor={'#455A64'}
          onChangeText={text => onChangeLocation(text)}
        />
        <TextInput
          style={styles.input}
          value={price}
          placeholder="How much are you asking? "
          placeholderTextColor={'#455A64'}
          keyboardType="numeric"
          onChangeText={text => onChangePrice(text)}
        />
        <TextInput
          style={styles.input}
          value={venmoID}
          placeholder="venmo ID "
          placeholderTextColor={'#455A64'}
          onChangeText={text => onChangeVenmo(text)}
        />
      </View>
      <Button style={styles.sellButton} onPress={() => handleSend()}>
        <Text style={{color: 'black', fontWeight: '400', fontSize: 20}}>
          {'Sell Now!'}
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#7BDCB5',
  },
  inputContainer: {
    marginTop: 35,
    width: '80%',
    height: '60%',
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: '10%',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sellButton: {
    marginTop: '25%',
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
});
