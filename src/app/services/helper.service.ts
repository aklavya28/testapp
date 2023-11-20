import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  get_current_user(local_s_type:string){

    let c_user:any = localStorage.getItem(local_s_type);
          let json_user = JSON.parse(c_user)
          return json_user
  }
}
