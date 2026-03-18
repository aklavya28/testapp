import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, NO_ERRORS_SCHEMA, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import {
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonTitle,
  IonMenuButton,
  LoadingController,
  IonSpinner
} from '@ionic/angular/standalone';
import { log } from 'console';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-verify-payment',
  templateUrl: './verify-payment.page.html',
  styleUrls: ['./verify-payment.page.scss'],
  standalone:true,
  schemas:[NO_ERRORS_SCHEMA],
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonTitle,
    IonMenuButton,
    IonSpinner,
  ]
})

export class VerifyPaymentPage implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();
  is_spinner:boolean = false
  error:string = ''
  verifyPaymentForm!: FormGroup;
  upload_date: any
  user_slug:string = ''
  today = Date.now()
  selectedFile: File | null = null;
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private api: LoginService,
    private cd: ChangeDetectorRef,
    private loader: LoadingController
  ) {}
  ngOnInit() {
    this.loader.create({
      message: "data saving"
    })
      this.verifyPaymentForm = this.loadForm()
      const current_user = JSON.parse(localStorage.getItem('current_user'))
      this.user_slug = current_user.user_id
      // console.log( current_user.user_id )
  }
  loadForm(){
    return this.fb.group({
      upload_date: [new Date().toISOString(), [Validators.required]],
      amount: ['', [Validators.required]],
      sreenshot: ['', [Validators.required]]
    })
  }
  setDate(event: any) {
    console.log(event, "anu")
    const date = event.detail.value;
    this.verifyPaymentForm.patchValue({
      upload_date: date
    });
  }
  preview: any;

   openFilePicker() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }
  onFileChange(event: any) {
    this.selectedFile= event.target.files[0];
    if (this.selectedFile) {
        this.verifyPaymentForm.patchValue({
          screenshot: this.selectedFile
        });
        this.verifyPaymentForm.get('screenshot')?.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
          this.preview = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
  }
  submit(){
    this.error = ''
    this.is_spinner = true
    if (this.verifyPaymentForm.invalid) {
        this.verifyPaymentForm.markAllAsTouched();
         this.is_spinner = false
      return;
    }
    // const data = this.verifyPaymentForm.value
    // console.log(this.selectedFile);
  const formData = new FormData();
  formData.append('screenshot', this.selectedFile);
  formData.append('amount', this.verifyPaymentForm.get('amount')?.value);
  formData.append('upload_date', this.verifyPaymentForm.get('upload_date')?.value);
  formData.append('user_id',this.user_slug)
  // this.user_slug
    this.api.upload_payment_screenshot(formData ).pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (res) => {
                    this.is_spinner = false
                    this.cd.detectChanges();
                    this.verifyPaymentForm.reset()
                    this.preview = ''
                    this.router.navigate(['/tabs/tabs/verified-payments'])
                },
                error: (err) => {
                  console.error(err);
                  this.error = err.error.error
                  this.is_spinner = false
                },
                complete: () => {
                  this.is_spinner = false
                  this.cd.detectChanges();
                },
              });

  }
   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete(); // ✅ triggers unsubscription
    }

}
