import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import Constants from '../constants/Contants.es6';
import Reflux from "reflux";
import _ from "lodash"

/**
 * Stored used in {@link FileUpload} component.
 */
const initialState = {
  autoGeocodeAll:           false,
  autoGeocodeAllWithoutLoc: false,
  overwriteProjects:        false,
  files:                    []
};

class ImportSore extends Reflux.Store {
  constructor() {
    super();
    this.state = initialState;
    
    this.listenTo(Actions.get(Constants.ACTION_TOGGLE_AUTOGEOCODE), this.toggleAutoGeocode);
    this.listenTo(Actions.get(Constants.ACTION_TOGGLE_OVERWRITEPROJECTS), this.toggleOverwriteProjects);
    this.listenTo(Actions.get(Constants.ACTION_SET_FILE), this.setFile);
    this.listenTo(Actions.get(Constants.ACTION_REMOVE_FILE), this.removeFile);
    
    this.listenTo(Actions.get(Constants.ACTION_UPLOAD_FILES_VALIDATION), this.setError);
    this.listenTo(Actions.get(Constants.ACTION_UPLOAD_FILES), this.upload);
    this.listenTo(Actions.get(Constants.ACTION_UPLOAD_FILES).completed, this.uploadCompleted);
    this.listenTo(Actions.get(Constants.ACTION_UPLOAD_FILES).failed, this.uploadFailed);
    
    this.listenTo(Actions.get(Constants.ACTION_CLEAN_IMPORT_STORE), this.cleanStore);
  }
  
  toggleAutoGeocode(autoType) {
    if (autoType === 'autoGeocodeAll') {
      this.setState({
        autoGeocodeAll:            !this.state.autoGeocodeAll,
        autoGeocodeAllWithoutLoc:  false
      });
    } else {
      if (autoType === 'autoGeocodeAllWithoutLoc') {
        this.setState({
          autoGeocodeAll:            false,
          autoGeocodeAllWithoutLoc:  !this.state.autoGeocodeAllWithoutLoc
        });
      } else {
        this.setState({
          autoGeocodeAll:            false,
          autoGeocodeAllWithoutLoc:  false
        });
      }
    }
  }
  
  toggleOverwriteProjects() {
    this.setState({overwriteProjects: !this.state.overwriteProjects});
  }
  
  setFile(files) {
    const newFiles = this.state.files.concat(files);
    
    this.setState({
      files: newFiles,
      error: undefined
    });
  }
  
  removeFile(name) {
    const newFiles = this.state.files.filter(file => file.name !== name);
    
    this.setState({
      files: newFiles
    });
  }
  
  setError(error) {
    this.setState({
      error
    });
  }
  
  upload(data) {
    const newFiles = [...this.state.files];
    newFiles.map(f => {
      f.status = 'LOADING';
      return f
    });
    this.setState({
      files: newFiles
    });
  }
  
  uploadCompleted(file, message) {
    const newFiles = [...this.state.files];
    const fileIndex = this.state.files.findIndex(f => f.name === file.name);
    newFiles[fileIndex].status = 'DONE';
    newFiles[fileIndex].message = message;
    
    this.setState({
      files: newFiles
    });
  }
  
  uploadFailed(data) {
    const {message, file} = data;
    const newFiles = [...this.state.files];
    const fileIndex = this.state.files.findIndex(f => f.name === file.name);
    newFiles[fileIndex].status = 'ERROR';
    newFiles[fileIndex].message = message;
    
    this.setState({
      files: newFiles
    });
  }
  
  cleanStore() {
    this.setState({
      autoGeocodeAll:           false,
      autoGeocodeAllWithoutLoc: false,
      overwriteProjects:        false,
      files:                    []
    })
  }
}

export default ImportSore;
