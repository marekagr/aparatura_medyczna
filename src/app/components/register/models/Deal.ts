export interface Deal {
  _id:string,
  name:string,
  type?:string,
  sn?:string,

  producer?: String,
  year_production?:String,
  deal_service?:String,
  opk?:String,
  number_of_deal?:String,
  deal_old_service?:String,
  date_of_last_inspection?:Date,
  date_of_next_inspection?:Date,
  inventory_number?:String,
  end_of_quarantee?:Date,
  inspection_period?:String,
  active?:Boolean,

  comments?:[],
  __v:Number
}