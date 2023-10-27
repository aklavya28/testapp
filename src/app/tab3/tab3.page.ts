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
    console.log(this.error )


    this.clientInfo = localStorage.getItem('current_user')
    this.tranferForm = this.fb.group({
      type: this.fb.control('',[Validators.required]),
      s_account: this.fb.control(null),
      amount: this.fb.control('', [Validators.required, this.min_val, this.mix_val]),
    })

     this.tranferForm.get('type')?.valueChanges.subscribe((res:string) =>{


      if(res === "bank"){
        this.saving_input = true
        this.cd.detectChanges();
        this.tranferForm.get('s_account')?.setValidators([Validators.required, Validators.maxLength(6), Validators.minLength(6)])
      }
      else{
        this.saving_input = false
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
      console.log(type)
    }
    // console.log([saving_ac, type, amount])

  }
  paywithin_bank(saving_ac:any, amount:any){
    // user_id: userid,
    //         token: token,
    //         res_ac: res_account,
    //         amount: amount
    let c_user:any = localStorage.getItem('current_user');
    let user_json = JSON.parse(c_user)
    this.api.withinbank(user_json.user_id, user_json.token, saving_ac, amount).subscribe((res) => {
      console.log(res)
    })

    console.log(user_json)
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
      console.log(reciver_saving)
      let current_user = JSON.parse(this.clientInfo);
      let token = current_user.token
      let user_id = current_user.user_id



      loading.present()
      this.api.check_saving(user_id, token, reciver_saving).subscribe((res) =>{
        loading.dismiss()
         let name = res.member.first_name
         let mobile = res.member.mobile_no
        console.log(res)
        this.reciver_detail = { name: name, mobile: mobile}

      }, (err)=>{
        loading.dismiss()
        this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      })
  }

  amount(){
      return this.tranferForm.get('amount');
  }
  s_account(){
      return this.tranferForm.get('s_account');
  }

}
