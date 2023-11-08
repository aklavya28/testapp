import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-opt',
  templateUrl: './opt.page.html',
  styleUrls: ['./opt.page.scss'],
})
export class OptPage implements OnInit {
  mobile:any =localStorage.getItem('mobile');
  otp:any;
  resendOtp:boolean = true;
  verfy:boolean = true
  error:any;
  constructor(
    private service: LoginService,
    private route: Router,
    private loding: LoadingController
  ) { }

  ngOnInit() {

    setTimeout(()=>{
      this.resendOtp = false
      },30000)
      if(this.get_current_user('current_user')){
        console.log(this.get_current_user('current_user'))
        // this.route.navigateByUrl('/tabs/tabs/dashboard')
       }
  }
  onOtpChange(e:any){
    if (e.length == 6){
      this.verfy = false
      this.otp = e
    }else{
      this.verfy = true
    }


    //yourvalue c an be any string or number
}
async check_otp(){

    if(this.mobile && this.otp ){
      const loading = await this.loding.create({
        message: 'Verifing OTP ...',

      });
      loading.present()
      this.service.verify_otp(this.mobile, this.otp).subscribe((res)=>{

        loading.dismiss()
        localStorage.removeItem('current_user');
        localStorage.setItem('current_user', JSON.stringify(res.data))
        this.error = ''
      this.route.navigateByUrl('/tabs/tabs/dashboard')
      }, (err) =>{
        loading.dismiss()

        this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      })
    }

}
resnd_otp(){

  this.service.mobile_login(this.mobile).subscribe((res)=>{
    console.log("resend otp", res)
    location.reload();
  }, (err)=>{
    console.log("resend otp", err)
    this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
  })
}
get_current_user(local_s_type:string){
  let c_user:any = localStorage.getItem(local_s_type);
        let json_user = JSON.parse(c_user)
        return json_user
}
}


// data
// :
// {user_id: "14783a9a-5f57-4376-8c74-494a5b2b6422", token: "hhxszvjzSFzimdyAQxaw"}
// message
// :
// "Request sent successfully"
// status
// :
// "success"
