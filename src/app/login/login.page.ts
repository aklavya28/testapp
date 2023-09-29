import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';


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

  memberForm: FormGroup;
  constructor(
      private fb: FormBuilder,
      private service: LoginService,
      private loding: LoadingController,
      private route: Router

    ) {
    this.memberForm = fb.group({
      username: fb.control('', [Validators.required, Validators.maxLength(10), Validators.minLength(6)]),
      password: fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    })

  }

  ngOnInit() {
  //  this.memberForm.get('username')?.setValue("M03229")
   this.memberForm.get('username')?.setValue("M08352")
   this.memberForm.get('password')?.setValue("123456")

  }
  async login(){
    const loading = await this.loding.create({
      message: 'Fatching data...',

    });
    loading.present();
    let username:string =  this.memberForm.get('username')?.value;
    let password:string =  this.memberForm.get('password')?.value;
    let post_Req = this.service.postLogin(username, password, this.u_type).subscribe((res:any) =>{
      loading.dismiss()
      console.log(res)
      // alert(res)
      localStorage.removeItem('current_user');
      localStorage.setItem('current_user', JSON.stringify(res))
      this.error = ''
      this.route.navigateByUrl('/tabs/tab1')
    }, (err) =>{

      loading.dismiss()
      this.error = err.error.message
    })


    // this.service.postLogin()

  }
  username(){
    return this.memberForm.get('username');
  }
  password(){
    return this.memberForm.get('password');
  }
  checkValue(event: any){
    console.log(event.target.checked)
  }

}
