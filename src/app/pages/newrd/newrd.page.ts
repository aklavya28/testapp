import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-newrd',
  templateUrl: './newrd.page.html',
  styleUrls: ['./newrd.page.scss'],
})
export class NewrdPage implements OnInit {
  service_type:string = ''
  newRdForm!:FormGroup;
  scheme:any;
  error:any;

  constructor(
    private route: ActivatedRoute,
    private helper: HelperService,
    private fb: FormBuilder,
    private service: LoginService,
    private loading: LoadingController,
    private router: Router,
    private alert: AlertController

  ) {

   }
   ionViewWillEnter(){
    this.newRdForm.reset()
    this.newRdForm.get('type')?.setValue(this.service_type)
   }
  async ngOnInit() {
    const loading = await this.loading.create({
      message: 'Fetching Details',
    })
    // form
    this.newRdForm = this.fb.group({
      schime: this.fb.control('', [Validators.required]),
      amount: this.fb.control(null),
      type: this.service_type
    })
    // form
    this.newRdForm.reset()
    this.service_type =  this.route.snapshot.params['type']
    let t =  this.newRdForm.get('type')?.setValue(this.service_type)

    if(this.newRdForm.get('type')?.value === "RdAccountSetting"){
      this.newRdForm.get('amount')?.setValidators([Validators.required, this.min_val_rd, this.max_val])
    }
    if(this.newRdForm.get('type')?.value === "FdAccountSetting"){
      this.newRdForm.get('amount')?.setValidators([Validators.required, this.min_val_fd, this.max_val])
    }



   let user = this.helper.get_current_user('current_user')
   loading.present()
   this.service.get_schemes(user.user_id, user.token, this.service_type).subscribe((res) =>{
    this.scheme = res.data
    loading.dismiss()
   }, (err)=>{
    loading.dismiss()
    this.error = err.error.message
  })

  }
  async confirmation(){
    let c_alert:any = await this.alert.create({
      message: "Are you sure?",
       buttons:[
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'cancel',
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: () => {
              this.newRdSubmit();
            },
            cssClass: 'confirm',
          },
        ]
      });
      c_alert.present()
  }
 async newRdSubmit(){
    this.error =''
    let amount:number =  this.newRdForm.get('amount')?.value
    let schime:string =  this.newRdForm.get('schime')?.value
    let type:any =  this.newRdForm.get('type')?.value

    let user = this.helper.get_current_user('current_user');
    const loading = await this.loading.create({
      message: 'Fetching Details',
    })
    loading.present()
    this.service.new_fd(user.user_id, user.token, amount, schime, type).subscribe((res)=>{
      const data = res.data
      data.datatype="rd"
      console.log("data prasms",JSON.stringify(data))
      this.router.navigate(['tabs/tabs/success', JSON.stringify(data)])

      loading.dismiss()
    }, (err)=>{
      loading.dismiss()
      this.error = err.error.message
    })

  }




  handleChange(ev) {
    console.log('Current value:', JSON.stringify(ev.target.value));
  }

  trackItems(index: number, item: any) {
    return item.id;
  }
  schime(){
    return this.newRdForm.get('schime');
  }
  amount(){
    return this.newRdForm.get('amount');
  }
  min_val_rd(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value < 100){
      return {min_val_rd: true }
    }
    return null
  }
  min_val_fd(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value < 1000){
      return {min_val_fd: true }
    }
    return null
  }
  max_val(Control: AbstractControl) :ValidationErrors | null{
    if(Control.value > 1000000){
      return {mix_val: true}
    }
    return null
  }
  back_btn() {
    this.router.navigateByUrl('/tabs/tabs/tab2');
  }

}
