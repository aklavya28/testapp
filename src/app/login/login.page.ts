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

  memberForm: FormGroup;
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

   this.memberForm.get('username')?.setValue("M03229")
  //  this.memberForm.get('username')?.setValue("M08352")
   this.memberForm.get('password')?.setValue("123456")

  }
  async login(){
    let data = localStorage.removeItem('current_user');

    const loading = await this.loding.create({
      message: 'Fatching data...',

    });
    loading.present();
    let username:string =  this.memberForm.get('username')?.value;
    let password:string =  this.memberForm.get('password')?.value;
    this.service.postLogin(username, password, this.u_type).pipe(

    )
    let post_Req = this.service.postLogin(username, password, this.u_type).subscribe((res:any) =>{
      loading.dismiss()
      localStorage.removeItem('current_user');
      localStorage.setItem('current_user', JSON.stringify(res))
      this.error = ''
      this.route.navigateByUrl('/tabs/tabs/dashboard')
    }, (err) =>{

      loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Server Not Found");
    })

    // this.service.postLogin()

    console.log(localStorage.getItem('current_user'))

  }

  ionViewWillEnter(){


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
