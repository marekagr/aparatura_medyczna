import { Injectable } from '@angular/core';
import { Subject, Subscription,BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { AppDictionaryService } from './app-dictionary.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = _moment;
// import { ModhyobittoDialogComponent } from './modules/__shared-utilities/modhyobitto-dialog/modhyobitto-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
// import { saveAs } from 'file-saver';



@Injectable({
  providedIn: 'root'
})
export class UtilityService extends AppDictionaryService{
  private currentSnackBar$ = new BehaviorSubject<any>({});

  private globals: { [key:string]: any } = {
    ongoing_request_count: 0,
    loading_animation_control: new Subject<any>(),
    banner_control: new Subject<any>()
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private overlay: Overlay
  ) { super(); }

  serviceWrapper(
    HTTP_method: string,
    API_URL: string,
    responseProcessing: any,
    request_data?: any,
    skip_loading_animation?: string
  ): Subject<any> {

    let response_subject = new Subject<any>();

    // If it has not been explicitly mentioned to not show the loader, please show.
    if(!!!skip_loading_animation){
      this.globals['ongoing_request_count'] ++;
      this.globals['loading_animation_control'].next(true);
    }

    // Hide snackbars and banners if any
    this.hideSnackbar();
    this.hideBanner();

    // For local API requests, fetch the JSON file instead
    // if(!environment.production || environment.production){
    //   HTTP_method = 'GET';
    //   API_URL += '.json';
    // }

    this.http.request(
      HTTP_method,
      API_URL,
      request_data
    ).pipe(
      finalize(
        () => {
          if(!!!skip_loading_animation){
            if(this.globals['.ongoing_request_count'] > 0){
              this.globals['.ongoing_request_count'] --;
            }
            // Hiding the loading animation
            this.globals['loading_animation_control'].next(false);
          }
        }
      )
    ).subscribe(
      (response: any) => {
        // If this is an error object directly send it across
        if(!!response['errorCode']){
          response_subject.error(response);
        }else{
          let processed_response = responseProcessing(response);
          if(!!processed_response.error){
            response_subject.error(processed_response.error);
          }else{
            response_subject.next(processed_response.data);
          }
        }
      },
      (error) => {
        let error_object = {
          'message' : this.error_messages.service_failure
        };
        response_subject.error(error_object);
      }
    );

    return response_subject;
  }

  login(user_credentials: any){
    let credentials = {...user_credentials};
    return this.serviceWrapper(
      'POST',
      this.getAPI('login'),
      (response: any) => {
        if(response.responseCode == 200){
          return (user_credentials.username=="error")?
                  {'error': response}: {'data': response};
        }else{
          return {'error': response};
        }
      },
      {
        body: credentials
      }
    );
  }

  // downloadFile(){
  //   return this.serviceWrapper(
  //     'POST',
  //     this.getAPI('file_download'),
  //     (response: any) => {
  //       let file_name = "dummy_file.pdf";
  //       saveAs(response, file_name);
  //       return {'data': {'message': 'download success'}};
  //     },
  //     {
  //       body: {
  //         'dummy': 'data'
  //       },
  //       responseType: "blob"
  //     }
  //   );
  // }

  uploadFile(form_data: any, API: string){
    return this.serviceWrapper(
      'POST',
      API,
      (response: any)=>{
        console.log('uploadFile',response)
        return {'data': response};
      },
      {
        body: form_data
      },
      'skip_loader_animation'
    );
  }

  showBanner(text?: string){
    let options = {
      to_show: true,
      text: text ||  this.error_messages.service_failure
    };
    this.globals['banner_control'].next(options);
  }

  hideBanner(){
    let options = {
      to_show: false
    };
    this.globals['banner_control'].next(options);
  }

  showSnackbar(message?: string){
    setTimeout(()=>{
      let snackar_ref = this.snackbar.open(
        message || this.error_messages.service_failure,
        'OK',
        {panelClass: 'modhyobitto-snackbar'});
      this.setGlobalData('global_snackbar',snackar_ref);
    },1200);
  }

  hideSnackbar(){
    this.getGlobalData('global_snackbar')?.dismiss();
  }

  // displayAlertDialog(options?: any){
  //   let global_options = {
  //     autoFocus: false,
  //     panelClass: 'modhyobitto-dialog-container',
  //     scrollStrategy: this.overlay.scrollStrategies.noop()
  //   };
  //   let dialog_config = {...global_options, ...options};
  //   let dialog_ref = this.dialog.open(
  //     ModhyobittoDialogComponent,
  //     dialog_config
  //   );
  //   return dialog_ref;
  // }

  toggleFormControls(
    form_group: FormGroup,
    control_list: string[],
    to_enable: boolean){
      let control_count = control_list.length;
      for(let i=0; i < control_count; i++){
        let current_control = form_group.get(control_list[i]);
        if(to_enable){
          current_control?.enable({emitEvent: false});
        }else{
          current_control?.disable({emitEvent: false});
        }
      }
  }

  scrollToElement(element_ref: any, offset = 10){
    setTimeout(()=>{
      let is_selector = (typeof element_ref) == 'string';
      let element = (is_selector)? document.querySelector(element_ref) : element_ref;
      let scroll_extent = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo(0, scroll_extent);
    }, 200);
  }

  onRouteActivation(){
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  navigateToURL(URL: string){
    this.router.navigateByUrl(URL);
  }

  /* TODO
  getCookie(name: string){
    return this.cookieService.get(name);
  }
  setCookie(name, value){
    this.cookieService.set(name, value, {path: '/', expires: new Date('12/31/9999')});
  }
  deleteCookie(name){
    this.cookieService.delete(name);
  }
  */

  unsubscribeAll(subs: Subscription[]){
    let sub_count = subs.length;
    for(let i=0; i < sub_count; i++){
      let current_sub = subs[i];
      if(!!current_sub){
        current_sub.unsubscribe();
      }
    }
  }

  setGlobalData(key: string, value: any){
    this.globals[key] = value;
  }

  getGlobalData(key: string){
    return this.globals[key];
  }

  appendToFormData(postData:FormData, data:any, key:string) {
    if ( ( typeof data === 'object' && data !== null ) || Array.isArray(data) ) {
        for ( let i in data ) {
            if ( ( typeof data[i] === 'object' && data[i] !== null ) || Array.isArray(data[i]) ) {
                this.appendToFormData(postData, data[i], key + '[' + i + ']');
            } else {
              postData.set(key + '[' + i + ']', data[i]);
            }
        }
    } else {
      postData.set(key, data);
    }
  }

  createFormData(postData:FormData,obiekt:any){
    // const postData = new FormData();
    // postData.set('ddd', 'ddd');
    Object.entries(obiekt).forEach(([key, data]) => {
       this.appendToFormData(postData,data,key)
      // console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
    //   if ( ( typeof data === 'object' && data !== null ) || Array.isArray(data) ) {
    //     for ( let i in data ) {
    //         if ( ( typeof data[i] === 'object' && data[i] !== null ) || Array.isArray(data[i]) ) {
    //             this.appendToFormData(postData, data[i], key + '[' + i + ']');
    //         } else {
    //           postData.append(key + '[' + i + ']', data[i]);
    //         }
    //     }
    // } else {
    //   postData.append(key, String(data));
    // }


    });

    postData.forEach((key,value)=>
    {
      console.log(key+ ', ' + value);
    })

    console.log('createFormData',postData);
    return postData;
  }

  updateCollection(collection:any[],result:any,key:string){
    const updatedItems=[...collection];
    const oldItemIndex=collection.findIndex(p=>p._id===result[key])
    collection[oldItemIndex]=result;
    // collection=updatedItems;
  }

  getParseUTCDate(data:any){
    if(typeof data == 'string' || typeof data == 'number')
      data=new Date(data);
    if(data instanceof moment)
      data=(<Moment>data).toDate()
    let dataH=new Date(data.getFullYear(),data.getMonth(),data.getDate(),1,5);
    // console.log(data,data.toUTCString(),dataH.toUTCString())
    return Date.parse(dataH.toUTCString());
  }

  getDateFromString(str:string,reg:RegExp,res:string){
    let newstr = str.replace(reg, res);
    let timestamp=Date.parse(newstr)
    console.log(timestamp,new Date(newstr),newstr)
    return this.getParseUTCDate(new Date(newstr))
  }


  getFileHeader(arr:any[]){
    let header = "";
    const extensions=['jpeg','gif','png','pdf']
    let result = null;
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    switch (header) {
      case "25504446":  //pdf
        result = 'pdf';
        break;
      case "89504e47":
        result = "png";
        break;
      case "ffd8ffe0":
        result = "jpeg";
        break;
      case "ffd8ffe1":
        result = "jpg";
        break;
        case "47494638":
        result = "gif";
        break;
      case "ffd8ffe2":
      case "ffd8ffe3":
      case "ffd8ffe8":
        result = '';
        break;
      default:
        result = ''; // Or you can use the blob.type as fallback
        break;
    }
    return result;
  }
  daysInMonth (month:number, year:number) {
    return new Date(year, month, 0).getDate();
  }

  getFirstAndLastDay(rok?:number,miesiac?:number) {
    var date = new Date();
    if(rok)date.setFullYear(rok);
    if(miesiac)date.setMonth(miesiac);
    // date.setMonth(date.getMonth()-1);
    var firstDay = new Date(date.getFullYear(),
                    date.getMonth(), 1,14);

    var lastDay = new Date(date.getFullYear(),
            date.getMonth(), this.daysInMonth(date.getMonth()+1,
            date.getFullYear()),14);
            // console.log('data:',firstDay,lastDay)
    return { first: firstDay, last: lastDay }
  }

  onFileLoad(result:any):any[] {
    // const textFromFileLoaded = fileLoadedEvent.target.result;
    // this.csvContent = textFromFileLoaded;
    // alert(this.csvContent);



    const csvSeparator = ';';
    // const textFromFileLoaded = fileLoadedEvent.target.result;
    // this.csvContent = textFromFileLoaded;
    // alert(textFromFileLoaded);

    // const txt = textFromFileLoaded;
    const txt =result;
    const csv:any[] = [];
    const lines = txt.split('\n');
    lines.forEach((element:string) => {
      const cols: string[] = element.split(csvSeparator);
      csv.push(cols.map(x=>x.trim()));
    });
    // this.parsedCsv = csv;
    // console.log(this.parsedCsv);
    return csv
  }



  setSnackBar$(data:{}){
    this.currentSnackBar$.next(data);
  }

  getSnackBar$() {
    return this.currentSnackBar$.asObservable();
  }

  openSnackBar(message: string, action: string,duration:number) {
    this.snackbar.open(message, action, {
      duration: duration,
      verticalPosition : 'top',
      horizontalPosition :'center'
    });
  }

  filterAutocomplete(value:string,arr:any[]):string[]{
    const filterValue = value.toLowerCase();
    return arr.filter(option => option.toLowerCase().includes(filterValue));
  }

}
