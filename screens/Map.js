import React, {useEffect, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import * as Location from 'expo-location';
//Importation du bouton permettant de relancer une recherche de spot
import ButtonRefresh from '../components/ButtonRefresh';

const Map = () => {

  const [loading, setLoading] = useState(true);

  const [errorLocation, setErrorLocation] = useState();

  const [spot, setSpot] = useState([]);
  const [sport, setSport] = useState([])

  const [longitude, setLongitude] = useState(5.522865888665046);
  const [latitude, setLatitude] = useState(43.217965376775766);

  const [northeastCoords, setNortheastCoords] = useState([]);
  const [southwestCoords, setSouthwestCoords] = useState([]);

  const [refresh, setRefresh] = useState(false);
  const [northeastRefresh, setNortheastRefresh] = useState([]);
  const [southwestRefresh, setSouthwestRefresh] = useState([]);



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
          selectedHobbies: []
        })
      })
      .then((response) => response.json())
      .then((json) => setSpot(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    })();



  }, []);

  // Récupération des spots dans l'API, lorsque les limites ont été déplacé et le bouton de relance a été cliqué
  function getMarkersApi(){
    fetch('https://sportihome.com/api/spots/getAllMarkersInBounds/'+southwestRefresh.longitude+','+southwestRefresh.latitude+'/'+northeastRefresh.longitude+','+northeastRefresh.latitude,
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        selectedHobbies: []
      })
    })
    .then((response) => response.json())
    .then((json) => setSpot(json))
    .catch((error) => console.error(error))
    .finally(() => setRefresh(false));

    console.log(refresh);

  }

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

    {loading ?
      <View>
        <Text style={styles.loadingText}>Chargement</Text>
        <ActivityIndicator size="small" color="#fff" />
      </View> :
      (

        <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{latitude: latitude, longitude: longitude, latitudeDelta: 0.5, longitudeDelta: 0.5}}
        showsUserLocation={true}
        onRegionChangeComplete={(pos) => {
          let northeast = {
            latitude: pos.latitude + pos.latitudeDelta / 2,
            longitude: pos.longitude + pos.longitudeDelta / 2,
          }
          , southwest = {
            latitude: pos.latitude - pos.latitudeDelta / 2,
            longitude: pos.longitude - pos.longitudeDelta / 2,
          };

          setNortheastRefresh(northeast);
          setSouthwestRefresh(southwest);
          setRefresh(true);
          console.log(refresh);

        }}
        >

        {spotMarkers()}



        </MapView>
      )
    }
    <View style={refresh ? {display: "block"} : {display:"none"}}>

      <ButtonRefresh
        action={()=>getMarkersApi()}
      />
    </View>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    backgroundColor: '#3589FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  loadingText: {
    color: '#FFF',
    marginBottom: 30,
    fontSize: 30,
    fontWeight: '700'
  },

})

export default Map
