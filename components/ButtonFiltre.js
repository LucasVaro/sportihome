import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ButtonFiltre = (props) =>{

  const {action} = props;

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={action}>
        <Ionicons name="md-options" size={25} color="#FFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    alignItems: 'center',
    justifyContent: "center",
    padding: 20,
    margin: 10
  },

})

export default ButtonFiltre
