import { HelperService } from './../../services/helper.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-transfer-history',
  templateUrl: './transfer-history.page.html',
  styleUrls: ['./transfer-history.page.scss'],
})
export class TransferHistoryPage implements OnInit {
  error:any;
  t_history:any;
  constructor(
    private api: LoginService,
    private loading: LoadingController,
    private helper: HelperService

  ) { }

  ngOnInit() {
    // location.reload()
    let user = this.helper.get_current_user('current_user');
    this.api.transfer_history(user.user_id, user.token).subscribe((res:any) =>{
        this.t_history = res.data
        // console.log(res)

    }, (err:any) =>{

      // loading.dismiss()
      this.error = err.error.message ? err.error.message : (err.statusText+ "! Something went wrong");
    })


  }
}
