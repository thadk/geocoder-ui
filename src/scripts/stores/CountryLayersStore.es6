import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import Constants from '../constants/Contants.es6';
import {StoreMixins} from '../mixins/StoreMixins.es6';

const initialData = {shapeList: []};
const CountryLayersStore = createStore({

  initialData: initialData,
  mixins: [StoreMixins],

  init() {
    this.data = initialData;
    this.listenTo(Actions.get(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST).completed, 'loadLayerList');
    this.listenTo(Actions.get(Constants.ACTION_ADD_COUNTRY_LAYER), 'addLayer');
    this.listenTo(Actions.get(Constants.ACTION_REMOVE_COUNTRY_LAYER), 'removeLayer');
    this.listenTo(Actions.get(Constants.ACTION_COUNTRY_LAYER_ADDED_TO_MAP), 'flagAdded');
    this.listenTo(Actions.get(Constants.ACTION_COUNTRY_LAYER_REMOVED_FROM_MAP), 'flagRemoved');
    this.listenTo(Actions.get(Constants.ACTION_CLEAN_MAP_STORE), 'cleanStore');
    this.listenTo(Actions.get(Constants.ACTION_TOGGLE_LAYER_VISIBILITY), 'toggleLayerVisibility');
  },

  cleanStore() {
    this.setData(this.initialData);
  },

  loadLayerList(list) {

    const newState = Object.assign({}, this.get());
    Object.assign(newState, {shapeList: list});
    this.setData(newState);
  },

  addLayer(countryISO) {

    let newState = Object.assign({}, this.get());
    const selectedLayer = newState.shapeList.find((it) => {
      return it.iso3 === countryISO
    });
if (selectedLayer){
    Object.assign(selectedLayer, {'visible': true, loading: true});//add it
    this.setData(newState);

    Actions.invoke(Constants.ACTION_LOAD_SHAPE, countryISO);
}
  },

  removeLayer(countryISO) {

    Actions.invoke(Constants.ACTION_UNLOAD_SHAPE, countryISO);

  },


  flag(iso,flag){
    let newState = Object.assign({}, this.get());
    let layer = newState.shapeList.find((it) => {
      return it.iso3 === iso
    });
    layer.added = flag;
    layer.loading = false;
    Object.assign(newState);
    this.setData(newState);
  },

  flagAdded(iso) {
    this.flag(iso,true)
  },

  flagRemoved(iso) {
    this.flag(iso,false)
  },

  toggleLayerVisibility(data) {/*
		var newState = Object.assign({}, this.get());
		var layers = newState.shapeList;
	    var layerToUpdate = layers.find((it) => {return it.iso===data.iso});
	    Object.assign(layerToUpdate, {visible: data.visible});//update visibility
	    Object.assign(newState, {'shapeList': layers});
	    this.setData(newState);
	    */
  },
});


export default CountryLayersStore;
