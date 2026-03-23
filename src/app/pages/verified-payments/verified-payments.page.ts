import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-verified-payments',
  templateUrl: './verified-payments.page.html',
  styleUrls: ['./verified-payments.page.scss'],
})
export class VerifiedPaymentsPage implements OnInit, OnDestroy{
   private destroy$ = new Subject<void>();
  is_spinner:boolean
  data:any[]= []
  user_slug:string = ''
  constructor(
    private cd: ChangeDetectorRef,
    private api: LoginService

  ) { }

  ngOnInit() {
    // this.load_data()
      const current_user = JSON.parse(localStorage.getItem('current_user'))
      this.user_slug = current_user.user_id
  }
   ionViewWillEnter() {
    this.load_data();
  }
  load_data(){
    this.is_spinner = true
    this.data = []

    this.api.get_verified_screenshots(this.user_slug).pipe(takeUntil(this.destroy$))
                  .subscribe({
                    next: (res) => {
                        this.is_spinner = false
                        this.data= res.data
                        this.cd.detectChanges();
                    },
                    error: (err) => {
                      console.error(err);
                      this.is_spinner = false
                    },
                    complete: () => {
                      this.is_spinner = false
                      this.cd.detectChanges();
                    },
                  });
  }
  // openModel(image_name:string){
  //   console.log(image_name)
  // }



   isModalOpen = false;
  // img_url:string = 'https://dev-rising-prod.s3.ap-south-1.amazonaws.com/screenshots/00925767-cf8a-4aa8-9d66-fa5f72f01c91.png'
  img_url:string = ''
  openModel(image_name:string) {
    this.isModalOpen = true;
    const base:string = "https://dev-rising-prod.s3.ap-south-1.amazonaws.com/screenshots/"
    this.img_url = `${base}${image_name}`
  }
  setOpen(isOpen:boolean){
     this.isModalOpen = false;
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete(); // ✅ triggers unsubscription
    }
}
