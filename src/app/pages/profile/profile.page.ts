import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userdata:any;
  error:string = '';
  constructor(
    private help: HelperService,
    private api: LoginService,
    private loading: LoadingController

  ) { }

  ngOnInit() {
    this.user_profile()
  }

  async user_profile(){
    const loading = await this.loading.create({
      message: 'Fetching profile ...',
    });
    let user =  this.help.get_current_user('current_user');
    loading.present()
    this.api.get_user_profile(user.token, user.user_id).subscribe((res:any)=>{
      loading.dismiss()
      this.userdata = res.data
      // console.log(res)
    }, (err:any)=>{
      loading.dismiss()
      // this.reciver_detail = null
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })
  }

}
