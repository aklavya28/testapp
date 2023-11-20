import {  Router, Routes, NavigationEnd } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { LoginService } from 'src/app/services/login.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-dashboad',
  templateUrl: './dashboad.page.html',
  styleUrls: ['./dashboad.page.scss'],
})
export class DashboadPage implements OnInit {
  current_user:any = localStorage.getItem('current_user');
  json_obj_current_user:any = JSON.parse(this.current_user);
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
    private app: AppComponent,
    private loader: LoadingController,

    ) {


  }

  async ngOnInit() {

      let user_id:string = this.json_obj_current_user.user_id;
      let token:string = this.json_obj_current_user.token;
      // local Storage



    // loader
    const loading = await this.loader.create({
      message: 'Keep patience data is loading ...'
    });
    loading.present()
    // loader

      this.api_service.postDashDetail(user_id,token).subscribe((t:any)=>{
        this.services = t
        this.pendig_data = t.req
        console.log(t.req)
        localStorage.removeItem('client_info');
        this.clientInfo = localStorage.setItem('client_info', JSON.stringify(this.services))


        loading.dismiss()
      }, (err) =>{

        console.log(err)
        this.router.navigateByUrl('/')
        loading.dismiss()
        // loading.present()

    })

  }
  sendService(id:number, type:string){
      // this.router.navigateByUrl("tab/transactions/"+id+"/"+type)
      this.router.navigateByUrl("tabs/tabs/transactions/"+id+"/"+type)

    //   this.route.snapshot.params
    // console.log([id, type])
  }


}
