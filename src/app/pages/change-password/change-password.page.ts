import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  passwordForm!: FormGroup;
  isSubmitting = false;

  showOld = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private api: LoginService,
    private loding: LoadingController,
    private helper: HelperService
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group(
      {
        old_password: ['', [Validators.required]],
        new_password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/),
          ],
        ],
        confirm_password: ['', [Validators.required]],
      },
      {
        validators: [
          this.passwordsMatchValidator,
          this.oldNewDifferentValidator,
        ],
      }
    );
  }

  /** Ensure new and confirm match */
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('new_password')?.value;
    const confirmPass = group.get('confirm_password')?.value;
    if (confirmPass && newPass !== confirmPass) {
      group.get('confirm_password')?.setErrors({ mismatch: true });
    } else {
      const errors = group.get('confirm_password')?.errors;
      if (errors && errors['mismatch']) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          group.get('confirm_password')?.setErrors(null);
        } else {
          group.get('confirm_password')?.setErrors(errors);
        }
      }
    }
    return null;
  }

  /** Ensure old password ≠ new or confirm */
  private oldNewDifferentValidator(group: AbstractControl): ValidationErrors | null {
    const oldPass = group.get('old_password')?.value;
        const newPass = group.get('new_password')?.value;
        if (oldPass && newPass && oldPass === newPass) {
          group.get('new_password')?.setErrors({ sameAsOld: true });
        } else {
          const errors = group.get('new_password')?.errors;
          if (errors) {
            delete errors['sameAsOld'];
            if (!Object.keys(errors).length) group.get('new_password')?.setErrors(null);
            else group.get('new_password')?.setErrors(errors);
          }
        }
        return null;
  }

  async onSubmit() {
    const loading = await this.loding.create({
      message: 'Loading ...',
    });
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    loading.present()
    this.isSubmitting = true;
    const { old_password, new_password } = this.passwordForm.value;
    const user = this.helper.get_current_user('current_user');

    this.api.change_password({ old_password, new_password }, user.user_id, user.token).subscribe({
      next: async (res: any) => {
        loading.dismiss()
        this.isSubmitting = false;
        const alert = await this.alertCtrl.create({
          header: 'Success',
          message: 'Password changed successfully!',
          buttons: ['OK'],
        });
        await alert.present();
        this.passwordForm.reset();
      },
      error: async (err) => {
        loading.dismiss()
        this.isSubmitting = false;
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err?.error?.message || 'Failed to change password.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  togglePassword(field: string) {
    if (field === 'old') this.showOld = !this.showOld;
    if (field === 'new') this.showNew = !this.showNew;
    if (field === 'confirm') this.showConfirm = !this.showConfirm;
  }

  // convenience getters
  old_password() {
    return this.passwordForm.get('old_password');
  }
  new_password() {
    return this.passwordForm.get('new_password');
  }
  confirm_password() {
    return this.passwordForm.get('confirm_password');
  }
}
