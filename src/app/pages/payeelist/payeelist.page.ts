import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
    private loader: LoadingController
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

  transfer(slug){
    this.router.navigateByUrl(`tabs/tabs/payeelist/transfer/${slug.slug}`)
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
