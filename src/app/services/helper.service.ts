import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  test:any;
  constructor(
    private api: LoginService,
    private loading: LoadingController

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
        // console.log("from helper", this.get_current_user('profile'))
      }, (err)=>{
       return err
      })
    }

  }

  async verify_accont(form,account:string ){
    const loading = await this.loading.create({
      message: 'Searching for saving details ...',
    });
    const observable = new Observable((subscriber) => {
      let current_user = this.get_current_user('current_user')
      let reciver_saving = form.get(account)?.value;
      loading.present()
      this.api.check_saving(current_user.user_id, current_user.token, reciver_saving).subscribe((res)=>{
        let name = res.member.first_name;
        let mobile = res.member.mobile_no;
        let test = { name: name, mobile: mobile };

        subscriber.next(test);
        subscriber.complete()
        loading.dismiss()
      },(err)=>{
        subscriber.error(err)
        loading.dismiss()
        subscriber.complete()
      })
      });
    return observable
  }


}
