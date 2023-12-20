import {  Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-dashboad',
  templateUrl: './dashboad.page.html',
  styleUrls: ['./dashboad.page.scss'],
})
export class DashboadPage implements OnInit {

  services:any;
  error:any;
  // account service info
  id:number = 0;
  ac_type:string = ''
  clientInfo:any = ''
  pendig_data:any;
  version:string = '28';
  // account service info


  constructor(private router: Router,
    private api_service: LoginService,
    private loader: LoadingController,
    private helper: HelperService,
    private alert: AlertController

    ) {


  }
  ionViewWillEnter(){
    // let user:any = this.helper.get_current_user('current_user');
    // this.api_service.check_version(user.user_id, user.token).subscribe((res) =>{
    //   console.log(res)
    // })
  }

  async ngOnInit() {

      // local Storage

    // loader
    const loading = await this.loader.create({
      message: 'Keep patience data is loading ...'
    });

    const alert =  await this.alert.create({
      header: 'Update App',

        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Update canceled');
            }
          }, {
            text: 'Update',
            handler: () => {
              window.open('https://play.google.com/store/apps/details?id=io.ionic.app2&hl=en-IN', '_system'); // Opens the Play Store link
            }
          }
        ],
    });
    loading.present()
    // loader
      let user:any = this.helper.get_current_user("current_user");

      this.api_service.postDashDetail(user.user_id,user.token, this.version).subscribe((t:any)=>{
        this.services = t
        this.pendig_data =t.req == ""? "":t.req;
        console.log("data",t)

        localStorage.removeItem('client_info');
        this.clientInfo = localStorage.setItem('client_info', JSON.stringify(this.services))


        loading.dismiss()
      }, (err:any) =>{

        loading.dismiss()
        if(err.error.message === "Update app"){
          alert.present()
          this.router.navigateByUrl('/')
        }else{
           this.error = err.error.message
            this.router.navigateByUrl('/')
        }

    })


  }
  sendService(id:number, type:string){

      this.router.navigateByUrl("tabs/tabs/transactions/"+id+"/"+type)
  }


}
