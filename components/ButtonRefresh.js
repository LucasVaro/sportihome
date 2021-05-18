import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';

const ButtonRefresh = (props) =>{

  const {action} = props;

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={action}>
          <Text style={styles.textButton}>Relancer la recherche</Text>
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
    backgroundColor: "#3589FF",
    alignItems: 'center',
    justifyContent: "center",
    padding: 20,
  },

  textButton:{
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: '700',
  }

})

export default ButtonRefresh
