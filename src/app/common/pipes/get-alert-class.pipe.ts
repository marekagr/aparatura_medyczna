
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getAlertClass',
  pure: true
})
export class GetAlertClassPipe implements PipeTransform {



  transform(value: unknown, ...args: unknown[]): {} {
    console.log('GetClassPipe',value,args)
    let result={}
    let key:any;
    let classDate=this.getDateClass(args)
    // let classMR=this.getMRClass(args)
    Object.assign(result,
       Object.keys(classDate).length>0 && classDate
      //  Object.keys(classMR).length>0 && classMR,
    )
    if(Object.keys(result).length>1){
       key=Object.keys(result).reduce(function(x:string,y){
         if(x<y)return x
         else return y
       })
       Object.keys(result).forEach(x=>{if(x!=key)delete result[x  as keyof typeof result]})
     }
     return result;
   //  return this.getDateClass(args)
  }

  getDateClass(args:any){

    let result={};
    if(args.length && typeof args[0][0]['date_of_next_inspection'] !='undefined'){
      const end=args[0][0]['date_of_next_inspection']
      const alertWarnDate=args[0][0]['alertWarnDate']
      const alertUrgentDate=args[0][0]['alertUrgentDate']
      const today=new Date();
      if(end){
        let dataEnd=new Date(end)
        Object.assign(result,
          dataEnd<=alertWarnDate && dataEnd>alertUrgentDate && {'raw--warm':true},
          dataEnd<=alertUrgentDate && dataEnd>today && {'raw--urgent':true},
          dataEnd<=today && {'raw--black':true},
        )
      }
    }
    console.log('getDateClass',result)
    return result
  }

  getMRClass(args:any){

    let result={};
    if(args.length && args[0][0]['eventTypeId']['isMeterReading'] && typeof args[0][0]['meter_reading_event'] !='undefined' && typeof args[0][0]['meter_reading'] !='undefined'){
      const meter_reading=args[0][0]['meter_reading']
      const meter_reading_event=args[0][0]['meter_reading_event']
      const alertWarnMR=args[0][0]['alertWarnMR']
      const alertUrgentMR=args[0][0]['alertUrgentMR']
      if(meter_reading_event && meter_reading){

        Object.assign(result,
          meter_reading_event-alertWarnMR<=meter_reading && meter_reading<meter_reading_event-alertUrgentMR && {'raw--warm':true},
          meter_reading_event-alertUrgentMR<=meter_reading && meter_reading<meter_reading_event && {'raw--urgent':true},
          meter_reading>=meter_reading_event && {'raw--black':true},
        )
      }
    }
    return result
  }

}
