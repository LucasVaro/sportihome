import React, {useEffect, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';


const Map = () => {

  const [loadingStep, setLoadingStep] = useState(true);
  const [loading, setLoading] = useState(true);


  const [errorLocation, setErrorLocation] = useState();
  const [spot, setSpot] = useState([]);
  const [longitude, setLongitude] = useState(5.522865888665046);
  const [latitude, setLatitude] = useState(43.217965376775766);

  const [northeastCoords, setNortheastCoords] = useState([]);
  const [southwestCoords, setSouthwestCoords] = useState([]);


  useEffect(() => {

    //Récupération de la localisation de l'utilisateur
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let latitude = location.coords.latitude;
      let longitude = location.coords.longitude;

      setLatitude(latitude);
      setLongitude(longitude);

      let northeast = {
        longitude: longitude + 0.5 / 2,
        latitude: latitude + 0.5 / 2
      }

      let southwest = {
        longitude: longitude - 0.5 / 2,
        latitude: latitude - 0.5 / 2
      }

      // Récupération des spots dans l'API Sportihome + Stockage dans le state
      fetch('https://sportihome.com/api/spots/getAllMarkersInBounds/'+southwest.longitude+','+southwest.latitude+'/'+northeast.longitude+','+northeast.latitude,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          selectedHobbies: ['KITEBOARDING', 'BMX']
        })
      })
      .then((response) => response.json())
      .then((json) => setSpot(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    })();



  }, []);

  // Affichage des spots stockés dans la state
  function spotMarkers(){
    return spot.map((marker, index) => (
      <Marker
      key={index}
      coordinate={{latitude : marker.loc.coordinates[1], longitude : marker.loc.coordinates[0] }}
      title={marker.name}
      description={marker.about}
      />
    ))
  }

  return(
    <View style={styles.container}>

    {loading ? <Text>Loading...</Text> :
      (
        <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{latitude: latitude, longitude: longitude, latitudeDelta: 0.5, longitudeDelta: 0.5}}
        showsUserLocation={true}
        >

        {spotMarkers()}

        </MapView>
      )
    }



    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height,
  }
})

export default Map
