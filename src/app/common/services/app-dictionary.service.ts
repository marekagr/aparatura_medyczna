import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GlobalVariable } from '../../../global';

@Injectable({
  providedIn: 'root'
})
export class AppDictionaryService {
  globalUrl=GlobalVariable.BASE_API_URL;

  // This service contains all the static mappings.
  //  This is not the central data store and hence, does not store the application state.

  error_messages = {
    service_failure: 'Wystąpił techniczny problem. Proszę odświeżyć stronę lub wysłać plik ponownie',
    validation: {
      percentage: 'Enter a percentage with max 2 decimal places.'
    }
  };

  regexes = {
    percentage: /^(\d{1,3})(\.\d{1,2})?$/
  };

  service_URLs: { [key:string]: string } = {
    'login': 'loginservice',
    'file_download': 'file_download',
    'file_upload': '',
    'table_row_add': 'table_row_add',
    'table_row_edit': 'table_row_edit'
  };

  // Mapping website host with API host
  API_hosts: { [key:string]: string } = {
    'dummyhost': 'http://localhost:3001/api'
  };

  // Mapping website host with environment if needed by the API
  environment_mapping = {
    'localhost' : 'DEV'
  };

  settings = {
    // API_full_hostname : 'http://localhost:3001/api1'
    API_full_hostname : `${this.globalUrl}`
  };

  constructor() {
    if(!environment.dummy_JSONs){
      let api_host = this.API_hosts[document.location.hostname];
      this.settings.API_full_hostname = document.location.protocol+"//"+api_host;
    }
  }

  getAPI(key: string){
    let complete_URL = this.settings.API_full_hostname+this.service_URLs[key];
    return complete_URL;
  }
}

