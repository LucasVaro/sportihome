import React, {useState} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SportItem = (props) =>{

  const {action, sport, index} = props;
  const [icon, setIcon] = useState("ios-add");


  function addFiltre(){

    if (icon == "ios-add") {
      setIcon("ios-close")
    }else {
      setIcon("ios-add")
    }
  }

  return (
    <Pressable
    key={index}
    // Petit problème, je n'ai pas réussi à mettre les 2 fonctions dans onPress
    onPressIn={()=>{addFiltre()}}
    onPress={action}
    >

    <View style={styles.containerSportItem}>
      <Text style={styles.sportItem}>{sport}</Text>
      <Ionicons name={icon} size={30}/>
    </View>

    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  sportItem:{
    fontSize: 20,
  },

  containerSportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },

})

export default SportItem
