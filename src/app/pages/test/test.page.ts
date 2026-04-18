import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { Sim } from '@jonz94/capacitor-sim';

@Component({
  selector: 'app-test',
  template: ''
})

export class TestPage implements OnInit {

  constructor(private router: Router,private loding: LoadingController) {}

  async ngOnInit() {
    await this.checkFlow();
  }

  async checkFlow() {
     const loading = await this.loding.create({
      message: 'Please wait ...'
    });
    loading.present();
    const verified = localStorage.getItem('simVerified');
    const mobile = localStorage.getItem('number');
    const currentUser =  localStorage.getItem('current_user');


    if (Capacitor.getPlatform() !== 'android') {
       loading.dismiss();
      this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
      return;
    }

    // Check permission status
    const status: any = await Sim.checkPermissions();
    console.log("status",status)
    const permissionGranted =
      status?.readPhoneState === 'granted' ||
      status?.android?.readPhoneState === 'granted';

    if (!permissionGranted) {
      localStorage.removeItem('simVerified');
      await loading.dismiss();
      this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
      return;
    }

    const result = await Sim.getSimCards();
    const simCards = result.simCards || [];
    if (!simCards.length) {
      await loading.dismiss();
      this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
      return;
    }

    if (currentUser && mobile && verified) {
      await loading.dismiss();
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    if (simCards.length > 1) {
      await loading.dismiss();
      this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
      return;
    }


    // if (verified === 'true' && mobile && permissionGranted) {
    //    loading.dismiss();
    //   this.router.navigateByUrl('/login', { replaceUrl: true });
    // } else {
    //    loading.dismiss();
    //   // If permission revoked
    //   if (!permissionGranted) {
    //     localStorage.removeItem('simVerified');
    //   }
    //    loading.dismiss();
    //   this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
    // }

    // const singleSimNumber = simCards[0].number;
    // localStorage.setItem('number', singleSimNumber);
    // localStorage.setItem('simVerified', 'true');
    loading.dismiss();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}
