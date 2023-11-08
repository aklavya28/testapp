import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-addbank',
  templateUrl: './addbank.page.html',
  styleUrls: ['./addbank.page.scss'],
})
export class AddbankPage implements OnInit {
  isActive:boolean = false;
  addBankForm!:FormGroup;
  error:string = '';
  personBank:any=[]
  banklist:any =[]


  constructor(
    private api: LoginService,
    private fb: FormBuilder,
    private loading: LoadingController

  ) { }

  ngOnInit() {
    let c_user:any = localStorage.getItem('current_user');
    let json_dtl = JSON.parse(c_user)
    this.api.get_personal_banks(json_dtl.user_id, json_dtl.token).subscribe((res) =>{
      this.personBank = res.data
      console.log(this.personBank)
    })

    this.addBankForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      ac_no: this.fb.control('', [Validators.required]),
      ifsc: this.fb.control('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)])
    })


  }
 async get_bank(){
    let c_user:any = localStorage.getItem('current_user');
    let dtl = JSON.parse(c_user);
    const loading = await this.loading.create({
      message: 'Fatching data...',

    });
    loading.present()
    this.api.list_of_bank(dtl.user_id, dtl.token).subscribe((res) =>{
      loading.dismiss()
      this.isActive = true
      this.addBankForm.reset()
      this.banklist = res
      console.log(this.banklist)
    }, (err) =>{
      loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })
  }
  async addBankSubmit(){
    // userid:string,
    // token:string,
    // bank_name: string,
    // bank_ac_no:number,
    // ifsc:string
    let c_user:any = localStorage.getItem('current_user');
    let json_user = JSON.parse(c_user)
    let bank_name = this.addBankForm.get('name')?.value
    let bank_ac_no = this.addBankForm.get('ac_no')?.value
    let ifsc = this.addBankForm.get('ifsc')?.value
      const loading = await this.loading.create({
        message: 'Saving Details...',
      });
      loading.present()
    this.api.addBankSubmit(json_user.user_id, json_user.token, bank_name, bank_ac_no, ifsc).subscribe((res) =>{
       console.log(res)
       loading.dismiss()
    }, (err) =>{
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
      loading.dismiss()
    })
    location.reload()

  }
  name(){
    return this.addBankForm.get('name')
  }
  ac_no(){
    return this.addBankForm.get('ac_no')
  }
  ifsc(){
    return this.addBankForm.get('ifsc')
  }

}
