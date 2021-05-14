import React, {useEffect, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const Map = () => {

  const [loading, setLoading] = useState(true);
  const [errorLocation, setErrorLocation] = useState();
  const [spot, setSpot] = useState([]);
  const [longitude, setLongitude] = useState(3.5854814830858133);
  const [latitude, setLatitude] = useState(43.442214487499285);

  useEffect(() => {
    // Récupération des spots dans l'API Sportihome + Stockage dans le state
    fetch('https://sportihome.com/api/spots/getAllMarkersInBounds/3.717044,43.476744/4.0312790000000005,43.743299900000004',
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
        onRegionChange={()=>{}}
        region={{latitude: latitude, longitude: longitude, latitudeDelta: 0.5, longitudeDelta: 0.5}}
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
