import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { CustomValidator } from 'src/app/services/validator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-addbank',
  templateUrl: './addbank.page.html',
  styleUrls: ['./addbank.page.scss'],
})
export class AddbankPage implements OnInit {
  isActive:boolean = false;
  addBankForm!:FormGroup;
  davSavingForm!:FormGroup;
  error:string = '';

  banklist:any =[]
  // segment
  segment: string = 'dev';
  checksaving_pro: boolean = false;
  payee_details:any;
  save_saving_btn:boolean= false;

  constructor(
    private api: LoginService,
    private fb: FormBuilder,
    private loading: LoadingController,
    private helper: HelperService,
    private router: Router,
    private tost: ToastController

  ) { }

  ionViewWillEnter(){

    this.get_bank()
    this.error = ''
    this.payee_details =''
    this.save_saving_btn= false
    this.davSavingForm.reset()
    this.addBankForm.reset()
    // console.log("ok",this.save_saving_btn)
    // this.davSavingForm.get('mobile')?.setValue('xxxxx-xxxxx')

  }

  ngOnInit() {



    this.addBankForm = this.fb.group({
      holder_name: this.fb.control('', [Validators.required]),
      name: this.fb.control('', [Validators.required]),
      ac_no: this.fb.control('', [Validators.required,Validators.maxLength(20), CustomValidator.numeric]),
      ifsc: this.fb.control('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)])
    })
    this.davSavingForm = this.fb.group({
      mobile: this.fb.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),CustomValidator.numeric ]),
      saving_ac: this.fb.control('', [Validators.required])

    })

  }
 async get_bank(){

    let c_user:any = localStorage.getItem('current_user');
    let dtl = JSON.parse(c_user);
    const loading = await this.loading.create({
      message: 'Fatching data...',

    });
    loading.present()
    this.api.list_of_bank(dtl.user_id, dtl.token).subscribe((res:any) =>{
      loading.dismiss()
      this.isActive = true
      this.addBankForm.reset()
      this.banklist = res
      // console.log(this.banklist)
    }, (err:any) =>{
      loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })
  }
async addBankSubmit(){
    let user:any = this.helper.get_current_user('current_user');
    let holder_name = this.addBankForm.get('holder_name')?.value
    let bank_name = this.addBankForm.get('name')?.value
    let bank_ac_no = this.addBankForm.get('ac_no')?.value
    let ifsc = this.addBankForm.get('ifsc')?.value
    // toast
    const success =  await this.tost.create({
      position: 'top',
      header: 'Payee Created Successfully',
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

    // toast

      const loading = await this.loading.create({
        message: 'Creating Payee..',
      });
      loading.present()
      this.api.addBank(user.user_id, user.token, bank_name, bank_ac_no, ifsc, holder_name, 'other').subscribe((res:any) =>{
       loading.dismiss()
        this.addBankForm.reset()

        success.present()
       this.router.navigateByUrl('/tabs/tabs/payeelist')

    }, (err:any) =>{
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      loading.dismiss()
    })


  }
// segment


 async devSubmit(){
    let user:any = this.helper.get_current_user('current_user');
    let saving_id = this.davSavingForm.get('saving_ac')?.value
    // console.log('saving_id', saving_id)

    const success =  await this.tost.create({
      position: 'top',
      header: 'Payee Created Successfully',
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

    // toast

      const loading = await this.loading.create({
        message: 'Creating Payee..',
      });

    if(user && saving_id){
      loading.present()
      this.api.addBankDev(user.user_id,user.token, saving_id).subscribe((res)=>{
        loading.dismiss()
        success.present()
        this.davSavingForm.reset()
        this.payee_details = ''
        this.router.navigateByUrl('/tabs/tabs/payeelist')
        // console.log(res)
         }, (err)=>{
          loading.dismiss()
        this.error = err.error.message
      })
    }
  }
  async check_mobile(){
    this.save_saving_btn = false
    this.payee_details =''
    this.error=''
    let mobile:string = this.davSavingForm.get('mobile')?.value
    let user = this.helper.get_current_user('current_user');
    const loading = await this.loading.create({
      message: 'Fetching Saving Details...',
    });

    loading.present()
    this.api.check_mobile(user.user_id, user.token, mobile).subscribe((res)=>{
      this.payee_details = res.saving
      this.save_saving_btn = true
      loading.dismiss()
    }, (err)=>{
      this.error = err.error.message
      loading.dismiss()
    })
    // console.log(mobile)
  }
  mobile(){
    return this.davSavingForm.get('mobile')
  }




// segment
  name(){
    return this.addBankForm.get('name')
  }
  ac_no(){
    return this.addBankForm.get('ac_no')
  }
  holder_name(){
    return this.addBankForm.get('holder_name')
  }
  ifsc(){
    return this.addBankForm.get('ifsc')
  }
  loc_reload(){
    location.reload()
  }
}
