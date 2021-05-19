import {StyleSheet, Dimensions} from 'react-native';

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
    borderWidth:2,
    borderColor:'#FFF',
    width: '80%',
    height: Dimensions.get('window').height-300,
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
  },

  favorisBtn: {
    position: 'absolute',
    right: 10,
    top: 10
  },

  titleFiltre: {
    marginTop: 10,
    textTransform: 'uppercase',
    fontSize: 20,
  },

  containerSport:{
    flexDirection: 'row',
    alignItems: 'center',
  },

  containerListeSports: {
    margin: 20,
    marginBottom: 40,
  },

  containerBtn: {
    flexDirection: 'row'
  },

  containerFiltre: {
    backgroundColor: '#FFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginTop: 10,
    padding: 40,
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center'
  },

  filtreBtn: {
    backgroundColor: '#3589FF',
    padding: 15,
    borderRadius: 10,
    width: Dimensions.get('window').width-20,
    alignItems: 'center'
  },

  textFiltreBtn: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: '700',

  },

  listSports: {
    height: '90%',
    width: '90%'
  },

})

export default styles;
