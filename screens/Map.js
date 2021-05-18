import React, {useEffect, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import * as Location from 'expo-location';
//Importation du bouton permettant de relancer une recherche de spot
import ButtonRefresh from '../components/ButtonRefresh';
import MarkerImg from '../assets/img/marker.png'

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


  const [modalState, setModalState] = useState(false);
  const [infoMarker, setInfoMarker] = useState();



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

  }

  // Affichage des spots stockés dans la state
  function spotMarkers(){
    return spot.map((marker, index) => (
      <Marker
      key={index}
      coordinate={{latitude : marker.loc.coordinates[1], longitude : marker.loc.coordinates[0] }}
      image={MarkerImg}
      onPress={()=>{
        setModalState(true);
        setInfoMarker({title:marker.name, description: marker.about})
      }}
      />
    ))
  }

  //Function qui permet d'affiicher les information du spots dans une modal
  function modal(){
    return <View style={styles.modal}>

      <View>
        <Text style={styles.modalTitle}>
          {infoMarker.title}
        </Text>
      </View>

      <ScrollView style={styles.containerDescription}>
        <Text style={styles.modalDescription}>
          {infoMarker.description}
        </Text>
      </ScrollView>

      <View style={styles.containerCloseBtn}>
        <Pressable style={styles.closeBtn} onPress={()=>{setModalState(false)}}>
          <Text style={styles.textCloseBtn}>Fermer</Text>
        </Pressable>
      </View>

    </View>
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

        }}
        >

        {spotMarkers()}

          {
            modalState ? (
              modal()
            ) : <View></View>
          }

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

  modal: {
    backgroundColor: '#FFF',
    width: '80%',
    height: 250,
    alignItems: 'center',
    paddingTop: 20,
    borderRadius: 10
  },

  modalTitle:{
    fontSize: 20,
    marginBottom: 10,
  },

  modalDescription:{
    fontSize: 14
  },

  containerCloseBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  closeBtn:{
    backgroundColor: '#3589FF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  textCloseBtn: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: '700'
  },

  containerDescription: {
    margin: 10,
    marginBottom: 40,
    paddingBottom: 10
  }

})

export default Map
