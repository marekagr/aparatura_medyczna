import { Directive,ElementRef,HostListener,Input, OnInit,AfterViewInit,OnDestroy,Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appInspectionPeriod]'
})
export class InspectionPeriodDirective implements OnInit, OnDestroy,AfterViewInit{
  private _phoneControl!:AbstractControl;
  private _preValue!:string;
  inputElement: HTMLInputElement;

  @Input() 
  set phoneControl(control:AbstractControl){
    this._phoneControl = control;
  }
  @Input() 
  set preValue(value:string){
    this._preValue = value;
  }
  private sub!:Subscription;
  private navigationKeys = [
   // 'Backspace',
    // 'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  regex?: RegExp=new RegExp("^\\d\\d:\\d\\d:\\d\\d$")
  regexLength:number=8


  constructor(private el: ElementRef,private renderer:Renderer2) { this.inputElement = el.nativeElement;}

  ngOnInit(){
    this.phoneValidate();
 }
 ngAfterViewInit(){
  
 }
 ngOnDestroy() {
   this.sub.unsubscribe(); 
 }

//------------------------ without subscription -------------------
@HostListener('keydown', ['$event'])
onKeyDown(e: KeyboardEvent) {
  console.log('onKeyDown',e.key);

  // if(e.key === ','){
  //     setTimeout(function() {
  //       e.target.value += '.';
  //     }, 4);
  //     event.preventDefault();
  //   };

  if (
    this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
    (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
    (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
    (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
    (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
    (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
    (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
    (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
    (e.key === 'x' && e.metaKey === true) ||
    (e.key==='Control') ||
    (e.key==='Shift') ||
    (e.key==='AltGraph')
    // || // Allow: Cmd+X (Mac)
    // (this.decimal && e.key === ',' && !this.hasDecimalPoint) ||
    // (this.decimal && e.key === this.decimalSeparator && !this.hasDecimalPoint) ||
    // (this.time && e.key === ':' && e.shiftKey === true ) // Allow: only one decimal point
  ) {
    // let it happen, don't do anything
    return;
  }

  if(e.key==='Backspace'){
    this.backspaceKey(e)
    return
  }

  if(e.key==='Delete'){
    this.deleteKey(e)
    return
  }


  // Ensure that it is a number and stop the keypress
  if (e.key === ' ' || isNaN(Number(e.key))) {
    e.preventDefault();
    return
  }

  // check the input pattern RegExp
  if (this.regex) {
    // let newValue = this.forecastValue(e.key);
    // newValue = this.addColon(newValue)
    // if (!this.check_regex(newValue)) {
    //   e.preventDefault();
    // }
    //else this.inputElement.value=newValue
    this.setPeriodValue(e)
  }
}

@HostListener('keyup', ['$event'])
onKeyUp(e: KeyboardEvent) {
  console.log('keyUp')
}



private setPeriodValue(e: KeyboardEvent){
  const selectionStart = this.inputElement.selectionStart!;
  const selectionEnd = this.inputElement.selectionEnd!+1;
  let oldValue = this.inputElement.value;
  let selection = oldValue.substring(selectionStart!, selectionEnd!);
  if(selectionStart<this.regexLength)
  {
    if(selection===':'){
      this.setNewValue(e.key,selectionStart+1,selectionEnd)
      this.inputElement.setSelectionRange(selectionStart+2, selectionStart+2)
      this.inputElement.focus();    
    }
    else
    {
      this.setNewValue(e.key,selectionStart,selectionEnd)     
      this.inputElement.setSelectionRange(selectionStart+1, selectionStart+1)
      this.inputElement.focus();  
    }
  }
  e.preventDefault();
}

private setNewValue(value:string,selectionStart:number,selectionEnd:number){
  let oldValue = this.inputElement.value;
  let newValue = oldValue.split('');
  for(let i=selectionStart;i<=selectionEnd && i<this.regexLength && i>=0;i++){
    if(newValue[i]!=':')
      newValue[i] = value;
  }
  this.inputElement.value = newValue.join('');
}


private backspaceKey(e: KeyboardEvent){
  let selectionStart = this.inputElement.selectionStart!;
  let selectionEnd = this.inputElement.selectionEnd!;
  let oldValue = this.inputElement.value;

    
  if(selectionStart>=0)
  {
    if(selectionStart==selectionEnd){
      selectionStart-=1     
    }
    let selection = oldValue.substring(selectionStart!, selectionEnd!);
    if(selection===':'){
      this.setNewValue('_',selectionStart-1,selectionEnd)     
      this.inputElement.setSelectionRange(selectionStart-1, selectionStart-1)
      this.inputElement.focus();       
    }
    else {
      this.setNewValue('_',selectionStart,selectionEnd) 
      // this.inputElement.selectionStart!=this.inputElement.selectionStart!-2
      // this.inputElement.selectionEnd=this.inputElement.selectionEnd;
      this.inputElement.setSelectionRange(selectionStart, selectionStart)
      this.inputElement.focus();        
    };
  }
  e.preventDefault();
}


private deleteKey(e: KeyboardEvent){
  const selectionStart = this.inputElement.selectionStart!;
  const selectionEnd = this.inputElement.selectionEnd!+1;
  let oldValue = this.inputElement.value;
  let selection = oldValue.substring(selectionStart!, selectionEnd!);
  if(selectionStart<this.regexLength)
  {
    if(selection===':'){
      this.setNewValue('_',selectionStart+1,selectionEnd)     
      this.inputElement.setSelectionRange(selectionStart+1, selectionStart+1)
      this.inputElement.focus();       
    }
    else {
      this.setNewValue('_',selectionStart,selectionEnd) 
      // this.inputElement.selectionStart!=this.inputElement.selectionStart!-2
      // this.inputElement.selectionEnd=this.inputElement.selectionEnd;
      this.inputElement.setSelectionRange(selectionStart, selectionStart)
      this.inputElement.focus();        
    };
  }
  e.preventDefault();
}



private check_regex(newValue:string):boolean{
  let result:boolean=false
  let  regexHelp: RegExp=new RegExp(this.regex!.source.substring(0,1+2*newValue.length))
  

  if (!regexHelp.test(newValue)) result=false
  else result=true
  return result
}

private forecastValue(key: string): string {
  const selectionStart = this.inputElement.selectionStart;
  const selectionEnd = this.inputElement.selectionEnd;
  const oldValue = this.inputElement.value;
  let selection = oldValue.substring(selectionStart!, selectionEnd!);
  selection=selection ? oldValue.replace(selection, key)
    : oldValue.substring(0, selectionStart!) +  key + oldValue.substring(selectionStart!);
  return selection
}

private addColon(newValue:string):string{
  let helpString=newValue.replace(/:/,'')
  if(! (helpString.length % 2))return newValue+=":"
  else return newValue
}
//-------------------- end without subscription








 phoneValidate(){

  this.sub = this._phoneControl.valueChanges.subscribe(data => {
    
    /**the most of code from @Günter Zöchbauer's answer.*/

    /**we remove from input but: 
       @preInputValue still keep the previous value because of not setting.
    */
    let preInputValue:string = this._preValue;
    var lastChar:string = preInputValue.substr(preInputValue.length - 1);
    // remove all mask characters (keep only numeric)
    var newVal = data.replace(/\D/g, '');

    let start = this.renderer.selectRootElement('#tel').selectionStart;
    let end = this.renderer.selectRootElement('#tel').selectionEnd;

    //let start=this.phoneRef.nativeElement.selectionStart;
    //let end = this.phoneRef.nativeElement.selectionEnd;
    //when removed value from input
    if (data.length < preInputValue.length) {
      // this.message = 'Removing...'; //Just console
    /**while removing if we encounter ) character,
      then remove the last digit too.*/
    if(preInputValue.length < start){
      if(lastChar == ')'){
        newVal = newVal.substr(0,newVal.length-1); 
      }
    }
    //if no number then flush
    if (newVal.length == 0) {
      newVal = '';
    } 
    else if (newVal.length <= 3) {
      /**when removing, we change pattern match.
      "otherwise deleting of non-numeric characters is not recognized"*/
      newVal = newVal.replace(/^(\d{0,3})/, '($1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
    }
   
    this._phoneControl.setValue(newVal,{emitEvent: false});
     //keep cursor the normal position after setting the input above.
    this.renderer.selectRootElement('#tel').setSelectionRange(start,end);
  //when typed value in input
  } else{
    // this.message = 'Typing...'; //Just console
    var removedD = data.charAt(start);
  // don't show braces for empty value
  if (newVal.length == 0) {
    newVal = '';
  } 
  // don't show braces for empty groups at the end
  else if (newVal.length <= 3) {
    newVal = newVal.replace(/^(\d{0,3})/, '($1)');
  } else if (newVal.length <= 6) {
    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
  } else {
    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
  }
  //check typing whether in middle or not
  //in the following case, you are typing in the middle
  if(preInputValue.length >= start){
    //change cursor according to special chars.
    // console.log(start+removedD);
    if(removedD == '('){
      start = start +1;
      end = end +1;
    }
    if(removedD == ')'){
      start = start +2; // +2 so there is also space char after ')'.
      end = end +2;
    }
    if(removedD == '-'){
      start = start +1;
      end = end +1;
    }
    if(removedD == " "){
        start = start +1;
        end = end +1;
      }
    this._phoneControl.setValue(newVal,{emitEvent: false});
    this.renderer.selectRootElement('#tel').setSelectionRange(start,end);
  } else{
      this._phoneControl.setValue(newVal,{emitEvent: false});
      this.renderer.selectRootElement('#tel').setSelectionRange(start+2,end+2); // +2 because of wanting standard typing
  }
}
});
}

}
