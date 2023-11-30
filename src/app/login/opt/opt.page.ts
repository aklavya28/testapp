import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-opt',
  templateUrl: './opt.page.html',
  styleUrls: ['./opt.page.scss'],
})
export class OptPage implements OnInit {

  // mobile:any =localStorage.getItem('mobile');
  mobile:any =this.helper.get_current_user('mobile');
  otp:any;
  resendOtp:boolean = true;
  verfy:boolean = true
  error:any;
  constructor(
    private service: LoginService,
    private route: Router,
    private loding: LoadingController,
    private helper: HelperService
  ) { }

  ngOnInit() {

    setTimeout(()=>{
      this.resendOtp = false
      },30000)

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
      this.service.verify_otp(this.mobile, this.otp).subscribe((res:any)=>{

        loading.dismiss()
        localStorage.removeItem('current_user');
        localStorage.setItem('current_user', JSON.stringify(res.data))
        localStorage.setItem('bio', JSON.stringify(res.data));


        this.error = ''
        this.route.navigateByUrl('/tabs/tabs/dashboard')
      }, (err:any) =>{
        loading.dismiss()

        this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      })
    }

}
resnd_otp(){

  this.service.mobile_login(this.mobile).subscribe((res:any)=>{
    console.log("resend otp", res)
    location.reload();
  }, (err:any)=>{
    console.log("resend otp", err)
    this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
  })
}

}

