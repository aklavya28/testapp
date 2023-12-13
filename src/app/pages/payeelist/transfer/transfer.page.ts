import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { min } from 'rxjs';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {
  slug:string;
  payee_detail:any;
  error:any;
  ransForm!:FormGroup;
  msg_success:any ="Transfer successfully";

  constructor(
    private active_route: ActivatedRoute,
    private router: Router,
    private api: LoginService,
    private helper: HelperService,
    private loading: LoadingController,
    private fb: FormBuilder,
    private toast: ToastController


  ) { }
 ionViewWillEnter(){
  this.error=''
 }
  ngOnInit() {
    this.slug = this.active_route.snapshot.params['slug'];


    this.ransForm = this.fb.group({
      amount: this.fb.control('', [Validators.required, this.min_val, this.mix_val]),
      bank_account_id: this.fb.control('')

    })
    this.getPayeeDetail(this.slug)



  }

   async getPayeeDetail(slug){
      let user = this.helper.get_current_user('current_user');
      const loading = await this.loading.create({
        message: 'Fetching Details',
      })
      loading.present()
      this.api.get_payee(user.token, user.user_id,  slug).subscribe((data)=>{
        this.payee_detail = data.data

          this.ransForm.get('bank_account_id')?.setValue(this.payee_detail.id);
        loading.dismiss()
      },(err)=>{
        loading.dismiss()
        this.error = err.error.message
      })

  }


  goBack(){
    this.router.navigateByUrl('tabs/tabs/payeelist');
  }
  amount(){
    return this.ransForm.get('amount');
}
  min_val(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value <  2){
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


 async transferSubmit(){

      const loading = await this.loading.create({
        message: 'Fetching Details',
      })

    let amout= this.ransForm.get('amount')?.value
    let bank_id = this.ransForm.get('bank_account_id')?.value
    let user:any = this.helper.get_current_user('current_user');
    loading.present()
    this.api.trnsfer_money(user.token, user.user_id, amout, bank_id).subscribe(async (res)=>{
      // console.log(res)
      const success =  await this.toast.create({
        position: 'top',
        header: res.message,
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

      loading.dismiss()
      this.router.navigateByUrl('tabs/tabs/dashboard')
      success.present()
    },(err)=>{
      this.error = err.error.message
      loading.dismiss()
    })


  }

}
