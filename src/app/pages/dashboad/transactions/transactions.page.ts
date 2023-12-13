import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

// pdf
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {
  Filesystem,
  Directory,
  Encoding,
  FilesystemDirectory,
} from '@capacitor/filesystem';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  all_transactions: any = '';
  acc_detail: { acc_id: number; type: string } | undefined;
  userid: string = '';
  token: string = '';
  balance: any;
  error: any;
  // pdf
  pdfObj: any;
  monthForm: FormGroup;
  isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LoginService,
    private loader: LoadingController,
    // pdf
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    // pdf month form
    private fb: FormBuilder,
    private helper: HelperService
  ) {
    this.monthForm = fb.group({
      months: fb.control('', [Validators.required]),
    });
  }
  ionViewWillEnter() {
    // console.log("transactions page")
    this.loadTransactionData();
  }
  ngOnInit() {}
  async loadTransactionData() {
    this.acc_detail = {
      acc_id: this.route.snapshot.params['account_id'],
      type: this.route.snapshot.params['type'],
    };

    const loading = await this.loader.create({
      message: 'Keep patience data is loading ...',
    });

    let user: any = this.helper.get_current_user('current_user');
    loading.present();
    this.service
      .transactions(
        user.user_id,
        user.token,
        this.acc_detail.acc_id,
        this.acc_detail.type
      )
      .subscribe(
        (res: any) => {
          this.all_transactions = res;
          loading.dismiss();
        },
        (err: any) => {
          console.log(err);
          this.router.navigateByUrl('tabs/tabs/dashboard');
          loading.dismiss();
          this.error = err.error.message
            ? err.error.message
            : err.statusText + '! Something went wrong';
          // loading.present()
        }
      );
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      window.location.reload();
    }, 2000);
  }
  async check_balanece(acc_detail: any) {
    let user: any = this.helper.get_current_user('current_user');
    let ac_type = acc_detail.type;
    let ac_id = acc_detail.acc_id;
    const loading = await this.loader.create({
      message: 'Checking Balance ...',
    });
    loading.present();
    this.service
      .check_balance(user.user_id, user.token, ac_type, ac_id)
      .subscribe(
        (res: any) => {
          // console.log(res);
          loading.dismiss();
          if (res === 0) {
            this.balance = '0.0';
          } else {
            this.balance = res;
          }
        },
        (err: any) => {
          loading.dismiss();
          // console.log(err);
          this.error = err.error.message  ? err.error.message : err.statusText + '! Something went wrong';
        }
      );
  }

  back_btn() {
    this.router.navigateByUrl('/tabs/tabs/dashboard');
  }

  pdf(row: any, type: string) {
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 10, 40, 60],
      content: [
        {
          layout: 'lightHorizontalLines',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],
            body: row,
          },
        },
      ],
    };

    if (this.platform.is('cordova')) {
      const genpdf = pdfMake.createPdf(docDefinition);
      genpdf.getBase64(async (data) => {
        // console.log('data', data);
        try {
          let path = `pdf/${type}_statement_${Date.now()}.pdf`;
          const res = await Filesystem.writeFile({
            path,
            data: data,
            directory: FilesystemDirectory.Documents,
            recursive: true,
          });
          this.fileOpener.open(`${res.uri}`, 'application/pdf');
        } catch (e) {
          console.error('Unable to write file ', e);
        }
      });
    } else {
      pdfMake.createPdf(docDefinition).download();
    }

    // this.pdfObj = pdfMake.createPdf(docDefinition).download();
    // this.pdfObj = pdfMake.createPdf(docDefinition).print();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.monthForm.reset();
  }
  async paySubmit() {
    let month = this.monthForm.get('months')?.value;
    let months: number = +month;
    if (this.acc_detail) {
      // console.log(this.helper.get_current_user('current_user'))
      let user = this.helper.get_current_user('current_user');
      const loading = await this.loader.create({
        message: 'loading Transactions ...',
      });
      loading.present();
      this.service.transactions_pdf(
          user.user_id,
          user.token,
          this.acc_detail.acc_id,
          this.acc_detail.type,
          months
        ).subscribe(
          (res) => {
            loading.dismiss();
            let t: any = res.data.unshift([
              'Date',
              'Message',
              'Type',
              'Amount',
            ]);
            // console.log(res.data)
            this.pdf(res.data, this.acc_detail.type);
            this.isModalOpen = false;
            this.monthForm.reset();
          },
          (err: any) => {
            loading.dismiss();
            this.monthForm.reset();
            this.error = err.error.message
              ? err.error.message
              : err.statusText + '! Something went wrong';
          }
        );

      // console.log("detail from submit", this.acc_detail, months)
    }
    // typeof(months)
  }
}
