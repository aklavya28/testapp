import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // url:string = 'https://app.devrising.in/api/hrms/'

  private mainurl:string = 'http://localhost:3000/api/'
  url:string = 'http://localhost:3000/api/hrms/';


 private loginUrl:string = 'http://localhost:3000/api/sign-in';

    constructor(private router: Router, private http: HttpClient) {

   }
   getusers(addparms:string){
    return   this.http.get(this.url+addparms)
   }

   postLogin(username:string, pass:string, type:string){

      return this.http.post<any>(this.loginUrl, {username: username, password:pass, type:type });
   }
   postDashDetail(userid:string, token:string){
      return  this.http.get<any>(this.mainurl+"app-dashboard?token="+token+"&user_id="+userid)
   }

   transactions(
      userid:string,
      token:string,
      acc:number,
      type: string
      ){
      return  this.http.get<any>(this.mainurl+"app-transactions?token="+token+"&user_id="+userid+"&acc="+acc+"&type="+type)
   }
   rd_due(
      userid:string,
      token:string,
      ac:number,
       ){
      return  this.http.get<any>(this.mainurl+"app-rd-due?token="+token+"&user_id="+userid+"&ac="+ac)
   }
   check_saving(
      userid:string,
      token:string,
      other_saving_ac:number,
       ){
      return  this.http.get<any>(this.mainurl+"app-check-saving?token="+token+"&user_id="+userid+"&other_saving_ac="+other_saving_ac)
   }


   pay(
      userid:string,
      token:string,
      ac_type:string,
      ac_id:number,
      amount:number
      ){
         return this.http.post<any>(this.mainurl+'app-pay', {user_id: userid, token: token, ac_type:ac_type, ac_id:ac_id, amount: amount });
   }
   withinbank(
      userid:string,
      token:string,
      res_account:string,
      amount:number
      ){
         return this.http.post<any>(this.mainurl+'app-withinbank', {
            user_id: userid,
            token: token,
            res_ac: res_account,
            amount: amount
         });
   }

}
