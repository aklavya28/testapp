import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // url:string = 'https://app.devrising.in/api/hrms/'
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

}
