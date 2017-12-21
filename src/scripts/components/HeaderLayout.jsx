import React from 'react';
import Reflux from "reflux";
import {Link} from 'react-router-dom';
import Message from './Message.jsx';
import * as Actions from '../actions/Actions.es6';
import Constants from '../constants/Contants.es6';
import LangStore from '../stores/LangStore.es6';

export default class HeaderLayout extends Reflux.Component {
  
  constructor() {
    super();
    this.store = LangStore;
  }
  
  changeLan(evt) {
    let lang = evt.target.value;
    Actions.invoke(Constants.ACTION_CHANGE_LANGUAGE, lang);
  }
  
  render() {
    return (
      <div className="header">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/"><Message k="header.branding"/></Link>
            </div>
            <div className="nav navbar-left">
              <div className="separator"/>
            </div>
  
            <div className="nav navbar-left">
              <li><Link to="/upload">Import Activities</Link></li>
            </div>
            
            <div className="nav navbar-rigth lan-selector-container">
              <select value={this.state.lang} name="lang" className="pull-right" onChange={this.changeLan}>
                <option value="en">{Message.t('header.language.english')}</option>
                <option value="es">{Message.t('header.language.spanish')}</option>
              </select>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}