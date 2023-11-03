import {GrantMenu} from "./GrantMenu"
export interface User {
  _id:string,
  user: string,
  // grantMenu?:{grantMenuId:GrantMenu}[];
  grantMenu?:any,
  grantDirectory?:any,
  column?:any,
  __v:Number
}
