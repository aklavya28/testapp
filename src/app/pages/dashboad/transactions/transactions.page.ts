import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  all_transactions:any= ''
  acc_detail: { acc_id: number; type: string; } | undefined
  userid:string = ''
  token:string = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LoginService,
    private loader: LoadingController

  ) {
    console.log(localStorage.getItem('current_user'))

  }

  async ngOnInit() {

    this.acc_detail = {
      acc_id: this.route.snapshot.params['account_id'],
      type: this.route.snapshot.params['type']

    }

    const loading = await this.loader.create({
      message: 'Keep patience data is loading ...'
    });
    // console.log(this.acc_detail.acc_id)
    // console.log(this.route.snapshot.params)

    let user_data:any = localStorage.getItem('current_user');
    let user_dtl_json = JSON.parse(user_data)
    this.userid = user_dtl_json.user_id;
    this.token = user_dtl_json.token;
    loading.present()


      this.service.transactions(this.userid,this.token,this.acc_detail.acc_id, this.acc_detail.type).subscribe((res)=>{
        this.all_transactions = res
        loading.dismiss()
      },(err) =>{

        console.log(err)
        this.router.navigateByUrl('tabs/tabs/dashboard')
        loading.dismiss()
        // loading.present()

    })


  }
  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      window.location.reload();
    }, 2000);
  }

}
