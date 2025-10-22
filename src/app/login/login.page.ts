import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  u_type: string = 'member';
  error: string = '';
  show_password: boolean = false;
  current_user: any = localStorage.getItem('current_user') ? localStorage.getItem('current_user') : '';
  newdata: any = '';

  viewMode: string = 'member';
  fpo: any;

  showbio:boolean= false

  memberForm: FormGroup;
  memberFormOtp!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private loding: LoadingController,
    private route: Router,
    private platform: Platform,
    private fp: FingerprintAIO,
    private helper: HelperService
  ) {
    this.memberForm = fb.group({
      username: fb.control('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(6),
      ]),
      password: fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  ionViewWillLeave() {
    // console.log('Home page will leave');
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener(
          'backbutton',
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            // console.log('hello sdfsdfsdfsfsfdsdf');
          },
          false
        );
      });
      // this.statusBar.styleDefault();
    });

    // console.log("histroy", history.pushState(null,'homepage', '/tabs/tabs/dashboard'))
  }
  ngOnInit() {
    localStorage.removeItem('current_user')
    // if (this.get_current_user('current_user')) {
    //   this.route.navigateByUrl('/tabs/tabs/dashboard');
    // }

    // this.memberForm.get('username')?.setValue('M10466');
    //  this.memberForm.get('username')?.setValue("M03229")
    //  this.memberForm.get('username')?.setValue("M00478")
    //  this.memberForm.get('username')?.setValue("M08352")
    // this.memberForm.get('password')?.setValue('123456');
    //  this.memberForm.get('password')?.setValue("Sunil@3546")
    //  this.memberForm.get('password')?.setValue("545A1E")
    // otp
    this.memberFormOtp = this.fb.group({
      mobile: this.fb.control('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
    });
    // otp end

    // bio
    if (this.helper.get_current_user("bio")){
        this.showbio = true
    }
    // bio end


  }
  show_bio(){
    if(this.helper.get_current_user('bio')){
        this.show_bio_init()
    }

  }
  show_bio_init(){
    this.fp
    .show(this.fpo)
    .then((success: any) => {
      // Fingerprint/Face was successfully verified
      // console.log(success);
      if(success){
        // alert(success)
        this.bio()

      }else{
        // alert("else")
      }
    })
    .catch((error: any) => {
      // Fingerprint/Face was not successfully verified
      // console.log(error.message);
      // alert(error.message)
    });
  }
  async login() {
    let data = localStorage.removeItem('current_user');

    const loading = await this.loding.create({
      message: 'Fatching data...',
    });
    loading.present();
    let username: string = this.memberForm.get('username')?.value;
    let password: string = this.memberForm.get('password')?.value;
    this.service.postLogin(username, password, this.u_type).subscribe(
      (res: any) => {
        loading.dismiss();
        localStorage.removeItem('current_user');
        localStorage.setItem('current_user', JSON.stringify(res));
        localStorage.setItem('bio', JSON.stringify(res));
        if (res.status === 'ERROR') {
          this.error = res.message;
        } else {
          this.error = '';


          this.route.navigateByUrl('/tabs/tabs/dashboard');
        }
        // history.pushState(null, '', 'pagename');
        //     window.addEventListener('popstate', function (event) {
        //         history.pushState(null, '/tabs/tabs/dashboard', 'pagename');
        // });
      },
      (err:any) => {
        loading.dismiss();
        this.error = err.error.message
          ? err.error.message
          : err.statusText + '! Server Not Found';
        // console.log('sunil', this.error);
      }
    );

    // this.service.postLogin()


  }
  async bio(){
    const loading = await this.loding.create({
      message: 'Verifing bio ...',
    });
   let user =  this.helper.get_current_user('bio')
    loading.present()
    this.service.bioLogin(user.user_id, user.token).subscribe((res:any) => {
      // console.log(res)
      loading.dismiss()
      localStorage.removeItem('current_user');
      localStorage.setItem('current_user', JSON.stringify(res.data))
      localStorage.setItem('bio', JSON.stringify(res.data));
      this.error = ''




        this.route.navigateByUrl('/tabs/tabs/dashboard')

    }, (err:any) => {
      loading.dismiss();
      // console.log(err);
      this.error = err.error.message
        ? err.error.message
        : err.statusText + '! Something went wrong';
    })

  }

  async loginOTP() {
    let mobile = this.memberFormOtp.get('mobile')?.value;

    const loading = await this.loding.create({
      message: 'Sending OTP ...',
    });
    loading.present();

    this.service.mobile_login(mobile).subscribe(
      (res:any) => {
        loading.dismiss();
        localStorage.setItem('mobile', mobile);
        this.route.navigateByUrl('opt', mobile);

      },
      (err:any) => {
        loading.dismiss();
        // console.log(err);
        this.error = err.error.message
          ? err.error.message
          : err.statusText + '! Something went wrong';
      }
    );
  }
  username() {
    return this.memberForm.get('username');
  }
  password() {
    return this.memberForm.get('password');
  }
  mobile() {
    return this.memberFormOtp.get('mobile');
  }

  send(d: string) {
    this.viewMode = d;
  }

  togglePassword() {
     this.show_password = !this.show_password;
  }
}
