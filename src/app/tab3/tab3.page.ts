import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  clientInfo:any = []
  tranferForm!: FormGroup;
  current_user:any = ''
  error:string = '';

  // forms
  saving_input:boolean | undefined;
  bank_input:boolean | undefined;
  banks:any;
  check_ac:boolean = false
  reciver_detail:any;



  constructor(
    private fb: FormBuilder,
    private api: LoginService,
    private loading: LoadingController,
    private router: Router,
    private tost: ToastController,
    private cd: ChangeDetectorRef
  ) {
  }


  ngOnInit(){
    this.clientInfo = localStorage.getItem('current_user')
    this.tranferForm = this.fb.group({
      type: this.fb.control('',[Validators.required]),
      s_account: this.fb.control(null),
      bank: this.fb.control(null),
      amount: this.fb.control('', [Validators.required, this.min_val, this.mix_val]),
    })

     this.tranferForm.get('type')?.valueChanges.subscribe(async (res:string) =>{
      if(res === "bank"){
        this.saving_input = true
        this.bank_input = false
        this.cd.detectChanges();

        this.tranferForm.get('s_account')?.setValidators([Validators.required, Validators.maxLength(6), Validators.minLength(6)])
        this.tranferForm.get('bank')?.setValidators(null)
        this.tranferForm.get('bank')?.patchValue('')
      }
      else{
        // checking bank
        this.cd.detectChanges();
        let data =  this.tranferForm.get('bank')?.setValidators([Validators.required]);
        let c_user = this.get_current_user('current_user');
        const loading = await this.loading.create({
          message: 'Searching for associated bank details ...',
        });
        loading.present();
        this.api.c_user_bank_status(c_user.user_id, c_user.token).subscribe((res:any) =>{
          loading.dismiss()
          this.banks = res.data

        }, (err:any) =>{
          loading.dismiss()
          setTimeout(()=>{
            this.router.navigateByUrl('/tabs/tabs/addbank')
          }, 2000)
        })
        // checking bank end


        this.saving_input = false
        this.bank_input = true
        this.cd.detectChanges();
          this.tranferForm.get('s_account')?.setValidators(null)
          this.tranferForm.get('s_account')?.patchValue('')
          this.reciver_detail = ''
      }
    })
  }




  transferSubmit(){

    let type = this.tranferForm.get('type')?.value
    let saving_ac = this.tranferForm.get('s_account')?.value
    let amount = this.tranferForm.get('amount')?.value


    if(type === 'bank'){
      // console.log(type)
      this.paywithin_bank(saving_ac,amount)
    }else{
      this.bank_trnsfer()
    }
    // console.log([saving_ac, type, amount])

  }

  async bank_trnsfer(){
    const loading = await this.loading.create({
      message: 'Please wait ...',

    });
    const success =  await this.tost.create({
      position: 'top',
      header: 'Transfer request sent successfully',
      cssClass: "green",
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
      })

    let user_json = this.get_current_user('current_user')

    let bank_id = this.tranferForm.get('bank')?.value
    let amount = this.tranferForm.get('amount')?.value
    loading.present()
    this.api.money_trns_to_other(user_json.user_id, user_json.token, bank_id, amount).subscribe((res:any) =>{
      console.log(res)
      loading.dismiss()
      success.present()
      this.tranferForm.reset()
      this.router.navigateByUrl('/tabs/tabs/dashboard')
    }, (err:any) => {
      loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })

  }



  async paywithin_bank(saving_ac:any, amount:any){
    const loading = await this.loading.create({
      message: 'Searching for details ...',

    });
    const success =  await this.tost.create({
      position: 'top',
      header: 'Transfer Successfully',
      cssClass: "green",
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
      })

    let user_json = this.get_current_user('current_user')
    loading.present()
    this.api.withinbank(user_json.user_id, user_json.token, saving_ac, amount).subscribe((res:any) => {
      loading.dismiss()
      success.present()
      this.tranferForm.reset()
      this.router.navigateByUrl('/tabs/tabs/dashboard')

    }, (err:any) =>{
      loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })

    console.log(user_json)
  }

  async other_bank_tranfer(json_u_dtl:any){
    const loading = await this.loading.create({
      message: 'Searching for associated bank details ...',
    });
    loading.present()
    this.api.c_user_bank_status( json_u_dtl.user_id, json_u_dtl.token ).subscribe((res:any) =>{
      loading.dismiss()
      console.log(res)
    }, (err:any) =>{
      loading.dismiss()
      setTimeout(()=>{
        this.router.navigateByUrl('/tabs/tabs/addbank')
      }, 2000)

      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })
  }



  min_val(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value <  1000){
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
  async verify_accont(){
    const loading = await this.loading.create({
      message: 'Searching for saving details ...',
    });


     let reciver_saving  =  this.tranferForm.get('s_account')?.value
     let current_user = this.get_current_user('current_user')

      loading.present()
      this.api.check_saving(current_user.user_id, current_user.token, reciver_saving).subscribe((res:any) =>{
        this.error = ''
        loading.dismiss()
         let name = res.member.first_name
         let mobile = res.member.mobile_no
         this.reciver_detail = { name: name, mobile: mobile}


      }, (err:any)=>{
        loading.dismiss()
        this.reciver_detail = null
        this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      })
  }

  amount(){
      return this.tranferForm.get('amount');
  }
  s_account(){
      return this.tranferForm.get('s_account');
  }
  bank(){
      return this.tranferForm.get('bank');
  }



  get_current_user(local_s_type:string){
    let c_user:any = localStorage.getItem(local_s_type);
          let json_user = JSON.parse(c_user)
          return json_user
  }
}
