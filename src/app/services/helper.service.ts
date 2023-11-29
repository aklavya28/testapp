import { Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private api: LoginService

  ) { }
  get_current_user(local_s_type:string){

    let c_user:any = localStorage.getItem(local_s_type);
          let json_user = JSON.parse(c_user)
          return json_user
  }
  getprofile() {

    let user:any =  this.get_current_user('current_user')

    if(user){

      this.api.get_user_profile( user.token,user.user_id).subscribe((res)=>{

          let name:string = `${res.data.member.first_name} ${res.data.member.last_name}`
          let img = res.data.profile_img.document.url
          let mobile = res.data.member.mobile_no
        const profile = {
          name: name,
          img: img,
          mobile:mobile
        }

        localStorage.setItem('profile', JSON.stringify(profile))
        console.log("from helper", this.get_current_user('profile'))
      }, (err)=>{
       return err
      })
    }

  }
}
