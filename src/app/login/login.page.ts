import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  u_type:string ='member';
  error:string = '';
  show_password:boolean = false
  current_user:any =  localStorage.getItem('current_user') ? localStorage.getItem('current_user') : '';
  newdata:any = ''

  viewMode:string = "otp"


  memberForm: FormGroup;
  memberFormOtp!: FormGroup;
  constructor(
      private fb: FormBuilder,
      private service: LoginService,
      private loding: LoadingController,
      private route: Router,
      private app: AppComponent

    ) {
    this.memberForm = fb.group({
      username: fb.control('', [Validators.required, Validators.maxLength(10), Validators.minLength(6)]),
      password: fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    })

  }

  ngOnInit() {

    // if(this.get_current_user('current_user')){
      // this.route.navigateByUrl('/tabs/tabs/dashboard')
    //  }


   this.memberForm.get('username')?.setValue("M03229")
  //  this.memberForm.get('username')?.setValue("M08352")
   this.memberForm.get('password')?.setValue("123456")
  // otp
    this.memberFormOtp = this.fb.group({
        mobile: this.fb.control('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
    })
  // otp end


  }
  async login(){
    let data = localStorage.removeItem('current_user');

    const loading = await this.loding.create({
      message: 'Fatching data...',

    });
    loading.present();
    let username:string =  this.memberForm.get('username')?.value;
    let password:string =  this.memberForm.get('password')?.value;
    this.service.postLogin(username, password, this.u_type).subscribe((res:any) =>{

      console.log('suniol', res.status)
      loading.dismiss()

      localStorage.removeItem('current_user');
      localStorage.setItem('current_user', JSON.stringify(res))
      if(res.status === "ERROR"){
        this.error = res.message

      }else{
        this.error = '';
        this.route.navigateByUrl('/tabs/tabs/dashboard')
      }

    }, (err) =>{

      loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Server Not Found");
      console.log("sunil",this.error)
    })

    // this.service.postLogin()

    console.log(localStorage.getItem('current_user'))

  }

  async loginOTP (){
   let mobile = this.memberFormOtp.get('mobile')?.value

   const loading = await this.loding.create({
    message: 'Sending OTP ...',
    });
    loading.present()

    this.service.mobile_login(mobile).subscribe((res) =>{
      loading.dismiss()
      localStorage.setItem("mobile", mobile);
      this.route.navigateByUrl('opt', mobile)
      console.log(res)
    }, (err) =>{
      loading.dismiss()
      console.log(err)
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })

  }
  username(){
    return this.memberForm.get('username');
  }
  password(){
    return this.memberForm.get('password');
  }
  mobile(){
    return this.memberFormOtp.get('mobile');
  }


  checkValue(event: any){
    console.log(event.target.checked)
  }
  send(d:string){
    this.viewMode = d
  }
  get_current_user(local_s_type:string){
    let c_user:any = localStorage.getItem(local_s_type);
          let json_user = JSON.parse(c_user)
          return json_user
  }
}
