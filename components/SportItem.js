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
    action()
  }

  return (
    <View key={index} style={styles.containerSportItem}>

      <Text style={styles.sportItem}>{sport}</Text>
      <Pressable
      onPress={()=>{addFiltre()}}
      >
      <Ionicons name={icon} size={30}/>
      </Pressable>

    </View>
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
