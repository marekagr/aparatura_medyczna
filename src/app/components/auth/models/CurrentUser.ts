export interface CurrentUser {
  _id:string;
  user: string;
  token?: string;
  grantMenu:string[];
  grantDirectory?:string[];
  expirationDate?:Date
}
