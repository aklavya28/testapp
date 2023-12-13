import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { LoadingController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  clientInfo:any = []
  payForm: FormGroup;
  current_user:any = ''
  error:string = '';
  disable:boolean = false

  constructor(
    private fb: FormBuilder,
    private api: LoginService,
    private loading: LoadingController,
    private router: Router,
    private tost: ToastController


    ) {
      this.payForm = fb.group({
        service: fb.control('', [Validators.required]),
        amount: fb.control('', [Validators.required, this.min_val, this.mix_val])
      })

  }
  ngOnInit(){

    let info:any = localStorage.getItem('client_info')
    this.clientInfo = JSON.parse(info)
    console.log('clint', this.clientInfo)
    this.payForm.get('service')?.valueChanges.subscribe(async (val)=>{
      console.log('testing', val)
      this.payForm.get('amount')?.enable()
      this.payForm.patchValue({ amount: 0});
      let rd_id =  val.split(',')[0]
      let s_type =  val.split(',')[1]

     if(s_type === "RD"){
      let login_user:any = localStorage.getItem('current_user');
      this.current_user = JSON.parse(login_user)
      let userid:string = this.current_user.user_id
      let token:string = this.current_user.token
      const rd_loder =  await this.loading.create({
        message: 'Fatching RD Due Installments...',

      });
      rd_loder.present()

      this.api.rd_due(userid, token, rd_id).subscribe((res:any) =>{
        rd_loder.dismiss()
        console.log(res.amount)
        // this.payForm.get('amount')?.value = res.amount

        this.payForm.patchValue({ amount: res.amount })
        this.payForm.get('amount')?.disable()
      },(err:any) =>{

        rd_loder.dismiss()

        this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      //  err.error.message ? err.error.message : (err.statusText+ "! Server Not Found");
      })

     }
    })
  }
 async paySubmit(){
      let service:string =  this.payForm.get('service')?.value;
      let login_user:any = localStorage.getItem('current_user');
      this.current_user = JSON.parse(login_user)
      let userid:string = this.current_user.user_id
      let token:string = this.current_user.token
      let ac_type:string = service.split(',')[1]
      let ac_id:any = service.split(',')[0]
      let amount:number =  this.payForm.get('amount')?.value;

       // post request
        const loading = await this.loading.create({
          message: 'Fatching data...',

        });
        const success =  await this.tost.create({
          position: 'top',
          header: 'Paid Successfully',
          cssClass: "green",
          color: 'success',
          buttons: [
            {
              icon: 'close',
              htmlAttributes: {
                'aria-label': 'close',
              },
            },
          ],
          })
        loading.present();
        this.api.pay(userid, token, ac_type, ac_id,amount).subscribe((res:any)=>{
            loading.dismiss()
              success.present()
              this.payForm.reset()
          // success.
          // window.location.reload()
          this.router.navigateByUrl('/tabs/tabs/dashboard')

        }, (err:any) =>{

          loading.dismiss()

          this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
        //  err.error.message ? err.error.message : (err.statusText+ "! Server Not Found");
        })














  }
  service(){
    return this.payForm.get('service');
  }
  amount(){
    return this.payForm.get('amount');
  }
  min_val(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value == 0){
      return {min_val: true }
    }
    return null
  }
  mix_val(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value > 1000000){
      return {mix_val: true}
    }
    return null
  }


}
