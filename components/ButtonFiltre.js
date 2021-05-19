import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';

const ButtonFiltre = (props) =>{

  const {action} = props;

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={action}>
          <Text style={styles.textButton}>Filtrer</Text>
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

  textButton:{
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: '700',
  }

})

export default ButtonFiltre
