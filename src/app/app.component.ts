import { Sim } from '@jonz94/capacitor-sim';
import { ChangeDetectorRef, Component, DoCheck, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonDatetimeButton, LoadingController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { HelperService } from './services/helper.service';
import { LoginService } from './services/login.service';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { NetworkService } from './services/network.service';
import { Subscription } from 'rxjs';
import { App } from '@capacitor/app';
import { AlertController } from '@ionic/angular';
import { NativeSettings, AndroidSettings } from 'capacitor-native-settings';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent implements OnInit {


  current_url: string = ''
  current_user: any;
  fingerprint: any;
  top: string = '';
  profileStatus: boolean = false;
  profile: any;
  isOnline: boolean = true;
  showBanner: boolean = false;
  // hidingBanner = false;
  bannerMessage: string = '';
  bannerColor: string = '';
  private hideTimer: any;
  private firstCheckDone = false;
  private wasOffline = false;
  private subscription!: Subscription;

  public appPages = [
    {
      title: 'Dashboad',
      url: "/tabs/tabs/dashboard", icon: 'grid'
    },
    {
      title: 'Pay EMI',
      url: "/tabs/tabs/tab1", icon: 'card'
    },
    {
      title: 'Add Beneficiary',
      url: "/tabs/tabs/addbank", icon: 'color-filter'
    },
    {
      title: 'Transfer Money',
      url: "/tabs/tabs/payeelist", icon: 'cash-outline'
    },
    // {
    //   title: 'Transfer',
    //   url: "/tabs/tabs/tab3", icon: 'repeat'
    // },
    {
      title: 'Profile',
      url: "/tabs/tabs/profile", icon: 'person-circle'
    },
    {
      title: 'Transfer History',
      url: "/tabs/tabs/t-history", icon: 'layers'
    },
    {
      title: 'Upload Payment Proof',
      url: "/tabs/tabs/verify-payment", icon: 'checkmark-done-outline'
    },
    {
      title: 'Deposit History',
      url: "/tabs/tabs/verified-payments", icon: 'checkmark-done-circle-outline'
    },
    {
      title: 'Change Password',
      url: "/tabs/tabs/changepassword", icon: 'lock-closed'
    },


    // { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    // { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },

  ];


  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private router: Router,
    private helper: HelperService,
    private api: LoginService,
    private loding: LoadingController,
    private networkService: NetworkService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private alertCtrl: AlertController
  ) {

    router.events.subscribe((event: any) => {
      // console.log(event)
      if (event instanceof NavigationEnd) {

        // your code will goes here
        this.current_url = event.url;
        localStorage.setItem('current_url', JSON.stringify(this.current_url))
      }

    })

  }

  async enableEdgeToEdge() {
    if (Capacitor.getPlatform() === 'android') {
      const info = await Device.getInfo();
      const version = parseInt(info.osVersion.split('.')[0]);
      if (version >= 15) {
        await EdgeToEdge.enable();
        await EdgeToEdge.setBackgroundColor({ color: '#fb6e23' });
      }
      await StatusBar.setStyle({ style: Style.Default });
    }
  }
  async open() {
    let user: any = this.helper.get_current_user('current_user')

    if (user) {
      const loading = await this.loding.create({
        message: 'Profile menu is loading ...'
      });
      // loading.present()
      this.api.get_user_profile(user.token, user.user_id).subscribe((res) => {
        loading.dismiss()
        let name: string = `${res.data.member.first_name} ${res.data.member.last_name}`
        let img = res.data.profile_img.document.url
        let mobile = res.data.member.mobile_no
        const profile = {
          name: name,
          img: img,
          mobile: mobile
        }
        this.profile = profile


        // console.log("from helper", this.get_current_user('profile'))
      }, (err) => {
        loading.dismiss()
        console.log(err)
      })
    }
  }
  async ngOnInit() {
    this.enableEdgeToEdge()
    this.helper.getprofile()
    this.subscription = this.networkService.networkStatus$.subscribe((online) => {
      this.clearHideTimer();
      // clearTimeout(this.hideTimer);
      // this.zone.run(() => {
      if (!this.firstCheckDone) {
        this.firstCheckDone = true;
        this.isOnline = online;
        this.wasOffline = !online;
        return;
      }

      this.isOnline = online;

      if (!online) {
        this.showOfflineBanner();
        this.wasOffline = true;
      } else if (this.wasOffline && online) {
        this.showOnlineBanner();
        this.wasOffline = false;
      }
    });
    // });
    // await this.ensureSimPermission();
  }

  async loadSim() {
    const result = await Sim.getSimCards();
    console.log('SIM Cards:', result.simCards);
  }

  async ensureSimPermission() {
    // const status = await Sim.checkPermissions();
    const status: any = await Sim.checkPermissions();
    console.log('Initial status:', status);

    if (
      status.readPhoneState === 'granted' &&
      status.readPhoneNumbers === 'granted'
    ) {
      return this.loadSim();
    }

    // Request permission
    const request = await Sim.requestPermissions() as any;

    if (
      request.readPhoneState === 'granted' &&
      request.readPhoneNumbers === 'granted'
    ) {
      return this.loadSim();
    }
    // If still not granted
    alert('SIM permission is mandatory for this app.');

    // Open app settings
    // await App.openSettings();
    this.showPermissionAlert();
  }

  async getSimCards() {
    const { simCards } = await Sim.getSimCards();
    console.log("my sim ", simCards);
    return simCards;
  }

  async checkPermissions() {
    const permissionStatus = await Sim.checkPermissions();

    console.log("checkPermissions", permissionStatus);

    return permissionStatus;
  }

  async requestPermissions() {
    const permissionStatus = await Sim.requestPermissions();

    console.log("requestPermissions", permissionStatus);

    return permissionStatus;
  }

  async showPermissionAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Permission Required',
      message: 'SIM access is mandatory for this app. Please enable it in Settings.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Open Settings',
          handler: async () => {
            await NativeSettings.openAndroid({
              option: AndroidSettings.ApplicationDetails,
            });
          }
        }
      ]
    });

    await alert.present();
  }


  ngDoCheck() {
    // console.log(this.profile, 'son',  this.getprofile())


    this.current_user = localStorage.getItem('current_user')
  }
  private showOfflineBanner() {
    this.zone.run(() => {
      this.bannerMessage = 'No Internet Connection';
      this.bannerColor = 'red';
      this.showBanner = true;
      // this.hidingBanner = false;
      this.cdr.detectChanges();
    });
  }

  private showOnlineBanner() {
    this.zone.run(() => {
      this.clearHideTimer();
      this.bannerMessage = 'Back Online';
      this.bannerColor = 'green';
      this.showBanner = true;
      // this.hidingBanner = false;
      this.cdr.detectChanges();

      this.hideTimer = window.setTimeout(() => {
        this.zone.run(() => {
          this.hideBanner();
        });
      }, 3000);
    });
  }

  private hideBanner() {
    this.zone.run(() => {
      // this.hidingBanner = true;
      this.cdr.detectChanges();

      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        this.zone.run(() => {
          this.showBanner = false;
          // this.hidingBanner = false;
          this.cdr.detectChanges();
        });
      }, 400); // Match animation duration
    });
  }

  private clearHideTimer() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
   async logout(): Promise<boolean> {
    const loading = await this.loding.create({
      message: 'Please wait ...'
    });
    loading.present();
    localStorage.removeItem('current_user')
    localStorage.removeItem('profile')
    localStorage.removeItem('bio')
    localStorage.clear();
    this.router.navigateByUrl('/')
    loading.dismiss();
    window.location.reload()
    return false

  }

  ngOnDestroy() {
    // this.clearHideTimer();
    if (this.subscription) this.subscription.unsubscribe();
  }


}

