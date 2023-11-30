import {  Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { LoadingController } from '@ionic/angular';
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
  // account service info


  constructor(private router: Router,
    private api_service: LoginService,
    private loader: LoadingController,
    private helper: HelperService

    ) {


  }

  async ngOnInit() {

      // local Storage

    // loader
    const loading = await this.loader.create({
      message: 'Keep patience data is loading ...'
    });
    loading.present()
    // loader
      let user:any = this.helper.get_current_user("current_user");

      this.api_service.postDashDetail(user.user_id,user.token).subscribe((t:any)=>{
        this.services = t
          this.pendig_data =t.req == ""? "":t.req;

        localStorage.removeItem('client_info');
        this.clientInfo = localStorage.setItem('client_info', JSON.stringify(this.services))


        loading.dismiss()
      }, (err:any) =>{

        // console.log(err)
        this.router.navigateByUrl('/')
        loading.dismiss()
        // loading.present()

    })


  }
  sendService(id:number, type:string){
      this.router.navigateByUrl("tabs/tabs/transactions/"+id+"/"+type)
  }


}
