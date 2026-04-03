import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-payeelist',
  templateUrl: './payeelist.page.html',
  styleUrls: ['./payeelist.page.scss'],
})
export class PayeelistPage implements OnInit {
  personBank:any;
  error:string;
  results:any;
  data:any;
  constructor(
    private api: LoginService,
    private helper: HelperService,
    private router: Router,
    private loader: LoadingController,
    private alertCtrl: AlertController,
        private tost: ToastController
  ) { }
  ionViewWillEnter() {
    // console.log("transactions page")
    this.getPayeesList();
  }
  ngOnInit() {
  }
  async getPayeesList(){
    const loading = await this.loader.create({
      message: 'Fetching Details payeelist',
    })
    loading.present()
    let user:any = this.helper.get_current_user('current_user');
    this.api.get_personal_banks(user.user_id, user.token).subscribe((res:any) =>{
      this.results = res.data;
      this.data = [...res.data]
      loading.dismiss()
    },(err)=>{
      this.error = err.error.message
      loading.dismiss()
    })

  }

  async deleteBank(bank: any, event: Event) {
    event.stopPropagation(); // Prevent transfer() click

    const alert = await this.alertCtrl.create({
      header: 'Delete Bank',
      message: 'Are you sure you want to delete this bank account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(bank);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDelete(bank: any) {
    console.log(bank)
    // return
    const loading = await this.loader.create({
      message: 'loading...',
    })
    const user = this.helper.get_current_user('current_user');
        loading.present()
    // this.api.deleteBank(bank.id).subscribe(() => {
    //   this.results = this.results.filter(b => b.id !== bank.id);
    // });

    this.api.delete_bank_acc(bank.id, user.user_id, user.token).subscribe({

      next: async (res: any) => {
        const success =  await this.tost.create({
          position: 'top',
          header: 'Account removed successfully!',
          cssClass: "green",
          color: 'success',
          duration: 5000,
          buttons: [
            {
              icon: 'close',
              htmlAttributes: {
                'aria-label': 'close',
              },
            },
          ],
        })
        //  this.results = this.results.filter(b => b.id !== bank.id);
        loading.dismiss()
        this.getPayeesList();
         success.present()
      },
      error: async (err) => {
        loading.dismiss()
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err?.error?.message || 'Failed to remove account.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

 async transfer(bank){
    const error = await this.tost.create({
      header:bank.note,
      position:'top',
      color:'danger',
      duration: 3000,
       buttons: [
                {
                  icon: 'close',
                  htmlAttributes: {
                    'aria-label': 'close',
                  },
                  },
        ],
    })
    if(bank.is_transferable){
      this.router.navigateByUrl(`tabs/tabs/payeelist/transfer/${bank.slug}`)
    }else{
      error.present()
    }
  }
  async handleInput(event){

    const query = event.target.value.toLowerCase();
    console.log( this.results)
    this.results = this.data.filter((d:any) => {
    return Object.keys(d)
    .some(function(k) {
              return d['holder_name'].toLowerCase().indexOf(query) !== -1;
          });
        });
    // console.log("res",this.results)
  }

}
