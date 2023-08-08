export interface Deal {
  _id:string,
  name:string,
  type:string,
  sn:string,


  own_number_of_deal?:number,
  number_of_deal:string,
  type_of_deal?:string,
  deal_name?: string,

  date_of_sign:Date,
  place_of_sign:string,
  date_of_deal_start:Date,
  date_of_deal_stop?:Date,

  part1_of_deal:string,
  part2_of_deal:string,
  representative1_of_deal?:[],
  representative2_of_deal?:[],

  issue_of_deal?:string,
  value_of_deal?:string,
  status?:string,

  date_of_registration?:Date,
  registration_business_unit?:string,
  registration_person?:string,

  cofinancing?:[],
  changeDeal?:[],
  terminationWithDeal?:[],
  terminationRest?:[],
  __v:Number
}
