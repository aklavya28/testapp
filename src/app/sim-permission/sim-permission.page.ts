import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sim } from '@jonz94/capacitor-sim';
import { NativeSettings, AndroidSettings } from 'capacitor-native-settings';
import { App } from '@capacitor/app';
import { LoginService } from '../services/login.service';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from '../services/helper.service';
import { NgZone } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-sim-permission',
  templateUrl: './sim-permission.page.html',
  styleUrls: ['./sim-permission.page.scss'],
})
export class SimPermissionPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  simCards: any[] = [];
  selectedSim: any = null;
  showSettingsButton = false;
  isReVerification = false;
  loading = true;

  private appListener: any;
  permissionMessage = '';
  showGrantButton = false;

  constructor(private router: Router,
    private api: LoginService,
    private helper: HelperService,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private loader: LoadingController

  ) {
  }

  async ngOnInit() {
    this.initialize();
    this.listenAppResume();
  }

  async initialize() {
    if (Capacitor.getPlatform() !== 'android') {

    this.permissionMessage =
      'Secure SIM verification is supported only on Android devices.\n\nPlease access this service using an Android device to continue.';

      this.showGrantButton = false;
      this.showSettingsButton = false;
      this.simCards = [];
      return;
    }

    const status: any = await Sim.checkPermissions();
    console.log("init  ",status)
    if (this.isGranted(status)) {
      await this.loadSim();
    } else {
      this.permissionMessage =
      'To securely verify your registered mobile number, this app requires access to your Phone permission.\n\nThis helps us confirm your identity and protect your account from unauthorized access.';
      this.showGrantButton = true;
    }

    const verified = localStorage.getItem('simVerified');
    const number = localStorage.getItem('number');
    if (verified === 'true' && number) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }
    this.loading = false;

  }

  isGranted(status: any): boolean {
    return (
      status.readPhoneState === 'granted' &&
      status.readPhoneNumbers === 'granted'
    );
  }

  async requestPermission() {
    const request: any = await Sim.requestPermissions();

    if (this.isGranted(request)) {
      this.showGrantButton = false;
      this.permissionMessage = '';
      await this.loadSim();
    } else {
     this.permissionMessage =
      'Phone permission is currently disabled.\n\nTo continue securely, please enable Phone permission from Settings.\n\nThis is required to verify your registered mobile number and protect your account.';
      this.showGrantButton = false;
      this.showSettingsButton = true;
    }
  }

  async loadSim() {
    const result = await Sim.getSimCards();
    this.simCards = result.simCards || [];
    console.log("loadsim dfdffd",this.simCards,this.simCards.length,!this.simCards.length)

    if (!this.simCards.length) {
      localStorage.clear()
      this.permissionMessage =
      'No active SIM card detected.\n\nPlease insert a valid SIM card linked to your registered mobile number to continue.';
      return;
    }else if(this.simCards.length > 1 && localStorage.getItem("current_user") == null){
      localStorage.clear();
       this.isReVerification = true;
      this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
      return;
    }
    else{
      this.isReVerification = true;
    }
  }

  async openSettings() {
    await NativeSettings.openAndroid({
      option: AndroidSettings.ApplicationDetails
    });
  }

  listenAppResume() {
     if (Capacitor.getPlatform() === 'android') {
        //  const verified = localStorage.getItem('simVerified');
        //   if (verified === 'true') {
        //     this.router.navigateByUrl('/login', { replaceUrl: true });
        //     return;
        //   }
      this.appListener = App.addListener('appStateChange', async ({ isActive }) => {
        console.log("is active",isActive)
        if (isActive) {
          this.zone.run(async () => {
            const status: any = await Sim.checkPermissions();
            if (this.isGranted(status)) {
              this.showSettingsButton = false;
              this.showGrantButton = false;
              this.permissionMessage = '';
              await this.loadSim();
            }
            this.cd.detectChanges();
          });
        }
      });
    }
  }

  async continue() {
    if (!this.selectedSim.number) return;
    const laoder = await this.loader.create({
      message: 'Please Wait...',
    });
    console.log("ssss", this.selectedSim.number)
    // localStorage.setItem('selectedSim', JSON.stringify(this.selectedSim));
    laoder.present()
    this.api.find_mobile(this.selectedSim.number).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(res)
          if (res.status === 'success') {
            localStorage.clear();
            // this.helper.setMobile();
             localStorage.setItem('number',this.selectedSim.number)
            localStorage.setItem('simVerified', 'true');
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
          laoder.dismiss()
          // this.cd.detectChanges();
        },
        error: (err) => {
          console.error(err);
           laoder.dismiss()
          const message = err?.error?.message || 'Unable to verify mobile number. Please try again.';
          alert(message);
        },
        complete: () => {
          laoder.dismiss()
        },
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.appListener) {
      this.appListener.remove();
    }
  }
}
