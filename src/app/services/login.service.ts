import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
//   private mainurl:string = 'http://localhost:3200/api/'
//
  private mainurl:string = 'https://app.devrising.in/api/'

    constructor(
      private router: Router,
      private http: HttpClient

      ) {

   }
   postLogin(username:string, pass:string, type:string){

      // return this.http.post<any>(this.loginUrl, {username: username, password:pass, type:type });
      return this.http.post<any>(this.mainurl+'sign-in', {username: username, password:pass, type:type });
   }
   bioLogin(user_id:string, token:string){

      // return this.http.post<any>(this.loginUrl, {username: username, password:pass, type:type });
      return this.http.post<any>(this.mainurl+'app-bio', {user_id, token });
   }
   postDashDetail(userid:string, token:string, version:string){
      return  this.http.get<any>(this.mainurl+"app-dashboard?token="+token+"&user_id="+userid +"&version="+version)
   }

   transactions(
      userid:string,
      token:string,
      acc:number,
      type: string
      ): Observable<any>{
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
   check_mobile(
      userid:string,
      token:string,
      mobile:string,
       ){
      return  this.http.get<any>(this.mainurl+"app-check-mobile?token="+token+"&user_id="+userid+"&mobile="+mobile)
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
   list_of_bank(
      userid:string,
      token:string

       ){
      return  this.http.get<any>(this.mainurl+"app-list-of-bank?token="+token+"&user_id="+userid)
   }
   c_user_bank_status(
      userid:string,
      token:string

       ){
      return  this.http.get<any>(this.mainurl+"app-c-user-bank-status?token="+token+"&user_id="+userid)
   }
   addBank(
      userid:string,
      token:string,
      bank_name: string,
      bank_ac_no:number,
      ifsc:string,
      holder_name:string,
      type:string
      ){
         return this.http.post<any>(this.mainurl+'app-add-bank-account', {
            user_id: userid,
            token: token,
            bank_name: bank_name,
            bank_ac_no: bank_ac_no,
            ifsc: ifsc,
            holder_name:holder_name,
            type: type
         });
   }
   addBankDev(
      userid:string,
      token:string,
      saving_id:string,
      ){
         return this.http.post<any>(this.mainurl+'app-add-bank-dev-account', {
            user_id: userid,
            token: token,
            saving_id:saving_id
         });
   }
   get_personal_banks(
      userid:string,
      token:string
       ){
      return  this.http.get<any>(this.mainurl+"app-get-personal-banks?token="+token+"&user_id="+userid)
   }

   money_trns_to_other(
      userid:string,
      token:string,
      bank_id: number,
      amount:number,
      ){
         return this.http.post<any>(this.mainurl+'app-bank-trnsfer', {
            user_id: userid,
            token: token,
            bank_id: bank_id,
            amount: amount,
         });
   }
   mobile_login(
      mobile: number
      ){
         return this.http.post<any>(this.mainurl+'app-mobile-login', {
            mobile: mobile,
         });
   }
   verify_otp(
      mobile: number,
      otp:number
      ){
         return this.http.post<any>(this.mainurl+'app-verify-otp', {
            mobile: mobile,
            otp: otp
         });
   }
   check_balance(
      user_id: string,
      token: string,
      ac_type: string,
      ac_id:number
      ){
         return this.http.post<any>(this.mainurl+'app-check-balance', {
            user_id,
            token,
            ac_type,
            ac_id

         });
   }
   trnsfer_money(
      token:string,
      user_id:string,
      amount:number,
      bank_id:number
       ){
         return this.http.post<any>(this.mainurl+'app-transfer-money', {
            token,
            user_id,
            amount,
            bank_id
         });
   }



   get_user_profile(
      token:string,
      userid:string
       ){
      return  this.http.get<any>(this.mainurl+"app-get-profile?token="+token+"&user_id="+userid)
   }
   get_payee(
      token:string,
      userid:string,
      slug:string
       ){
      return  this.http.get<any>(this.mainurl+"app-get-payee?token="+token+"&user_id="+userid+"&slug="+slug)
   }


   transfer_history(
      userid:string,
      token:string
       ){
      return  this.http.get<any>(this.mainurl+"app-transfer-history?token="+token+"&user_id="+userid)
   }
   check_version(
      userid:string,
      token:string
       ){
      return  this.http.get<any>(this.mainurl+"app-check-version?token="+token+"&user_id="+userid)
   }

   transactions_pdf(
      userid:string,
      token:string,
      ac_id:number,
      ac_type:string,
      time:number
       ){
      return  this.http.get<any>(this.mainurl+"app-transactions-pdf?token="+token+"&user_id="+userid+"&ac_id="+ac_id+"&ac_type="+ac_type+"&time="+time)
   }
   get_schemes(
      userid:string,
      token:string,
      ac_type:string,
       ){
      return  this.http.get<any>(this.mainurl+"app-get-scheme?token="+token+"&user_id="+userid+"&ac_type="+ac_type)
   }

   new_fd(
      user_id:string,
      token:string,
      amount:number,
      schime:string,
      type:string
       ){
         return this.http.post<any>(this.mainurl+'app-new-fd', {
            token,
            user_id,
            amount,
            schime,
            type
         });
   }

   getBooks(
      userid:string,
      token:string,

   ): Observable<any[]> {

      return this.http.get<any[]>(this.mainurl+"app-get-profile?token="+token+"&user_id="+userid)
   //    .pipe(
   //       tap(data => console.log('All Products', JSON.stringify(data))),

   //   );

   }

   change_password(
      data:any,
      user_id:string,
      token:string,
       ){
         return this.http.post<any>(this.mainurl+'app-change-password', {
            data,
            user_id,
            token
         });
   }
}
