import React, {useEffect, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { Text, View, ScrollView, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import * as Location from 'expo-location';
//Importation du bouton permettant de relancer une recherche de spot
import ButtonRefresh from '../components/ButtonRefresh';
import ButtonFiltre from '../components/ButtonFiltre';
import SportItem from '../components/SportItem'

import MarkerImg from '../assets/img/marker.png'
import MarkerImgFav from '../assets/img/markerfav.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultiSelect from 'react-native-multiple-select';

import styles from './styles'
import listeSports from '../data/listeSports'


const Map = (props) => {

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

  const [favoris, setFavoris] = useState([])
  const [logoFav, setLogoFav] = useState('ios-heart-outline')

  const [filtreMap, setFiltreMap] = useState(true)


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
          selectedHobbies: sport
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
        selectedHobbies: sport
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
      image={imageFavoris(marker._id)}
      onPress={()=>{
        setModalState(true);
        setInfoMarker({title:marker.name, description: marker.about, id: marker._id})
        verifFavorisLogo(marker._id)
      }}
      />
    ))
  }

  //Fonction qui permet de mettre à jour le state qui charge le logo de l'ajout / retrait de favoris, afin qu'à l'ouverture de la modal le logo soit coché si le spot est favoris et inversement
  function verifFavorisLogo(idSpot){

    let favSpotArray = favoris;

    let verifExist = favSpotArray.indexOf(idSpot);

    if (verifExist == -1) {
      setLogoFav('ios-heart-outline')
    }else {
      setLogoFav('ios-heart')
    }

  }

  //Function qui permet d'afficher les informations du spot dans une modal
  function modal(){

    return <View style={styles.modal}>

    <Pressable style={styles.favorisBtn} onPress={()=>{favorisSpots(infoMarker.id)}}>
    <Ionicons name={logoFav} size={20} color="#000" />
    </Pressable>

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

  //Fonction qui permet de changer l'image du marker lorsqu'il est favoris
  function imageFavoris(idSpot){
    let favSpotArray = favoris;

    let verifExist = favSpotArray.indexOf(idSpot);

    if (verifExist == -1) {
      return MarkerImg
    }else {
      return MarkerImgFav
    }

  }

  //Fonction qui permet d'ajouter ou retirer un spot des favoris
  function favorisSpots(idSpot){

    if(logoFav === "ios-heart-outline") {
      setLogoFav('ios-heart')
    }else if (logoFav === "ios-heart") {
      setLogoFav('ios-heart-outline')
    }

    let favSpotArray = favoris;

    let verifExist = favSpotArray.indexOf(idSpot);

    if (verifExist == -1) {
      favSpotArray.push(idSpot);
    }else {
      favSpotArray.splice(verifExist);
    }

    setFavoris(favSpotArray)

  }

  //Fonction qui permet d'afficher tous les sports dispo dans l'API sportihome
  function listSports(){
    return listeSports.map((item, i) => (
      <SportItem key={i} index={i} sport={item} action={()=>{stepFiltre(item)}}></SportItem>
    ));
  }

  //Fonction qui permet d'ajouter un sport dans le filtre
  function stepFiltre(itemSport){

    let listeFiltre = sport;

    let verifExist = listeFiltre.indexOf(itemSport)

    if (verifExist == -1) {
      listeFiltre.push(itemSport)
    }else{
      listeFiltre.splice(verifExist)
    }

    setSport(listeFiltre)
  }

  return(
    <View style={styles.container}>

    {loading ?
      <View>
      <Text style={styles.loadingText}>Chargement</Text>
      <ActivityIndicator size="small" color="#fff" />
      </View> :
      filtreMap ?
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
      ) : (
        <View style={styles.containerFiltre}>
        <ScrollView style={styles.listSports} showsVerticalScrollIndicator={false}>
        {listSports()}
        </ScrollView>
        <View>
        <Pressable style={styles.filtreBtn} onPress={()=>{
          getMarkersApi()
          setFiltreMap(true)
        }}>
        <Text style={styles.textFiltreBtn}>Filtrer</Text>
        </Pressable>
        </View>
        </View>
      )
    }
    <View style={loading ?  {display:"none"} : filtreMap ? styles.containerBtn : {display:"none"}}>
    <ButtonFiltre
    action={()=>{
      setFiltreMap(false)
      setSport([])
    }}
    />
    <View style={refresh ? {display: "block"} : {display:"none"}}>
    <ButtonRefresh
    action={()=>getMarkersApi()}
    />
    </View>
    </View>
    </View>
  )

}

export default Map
