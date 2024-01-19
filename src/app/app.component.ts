import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { HelperService } from './services/helper.service';
import { LoginService } from './services/login.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  current_url:string =''
  current_user:any;
  fingerprint:any;
  top:string='';
  profileStatus:boolean=false;
  profile:any;

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
      url: "/tabs/tabs/payeelist", icon: 'people'
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
    private platform: Platform,
    private helper: HelperService,
    private api: LoginService,
    private loding: LoadingController
      ) {

    router.events.subscribe((event:any) =>{
      // console.log(event)
      if (event instanceof NavigationEnd ) {

        // your code will goes here
        this.current_url = event.url;
        localStorage.setItem('current_url', JSON.stringify(this.current_url))
      }

    })

  }
  async open(){
    let user:any =  this.helper.get_current_user('current_user')

    if(user){
      const loading = await this.loding.create({
        message: 'Profile menu is loading ...'
      });
      // loading.present()
      this.api.get_user_profile( user.token,user.user_id).subscribe((res)=>{
        loading.dismiss()
          let name:string = `${res.data.member.first_name} ${res.data.member.last_name}`
          let img = res.data.profile_img.document.url
          let mobile = res.data.member.mobile_no
        const profile = {
          name: name,
          img: img,
          mobile:mobile
        }
        this.profile = profile


        // console.log("from helper", this.get_current_user('profile'))
      }, (err)=>{
        loading.dismiss()
        console.log(err)
      })
    }
  }
 async ngOnInit(){
    if(this.platform.is('android')){
          StatusBar.setOverlaysWebView({ overlay: false })
          StatusBar.setBackgroundColor({color: "#fb6e23"})
      }
      this.helper.getprofile()
  }
  ngDoCheck( ){
    // console.log(this.profile, 'son',  this.getprofile())


    this.current_user = localStorage.getItem('current_user')
  }
 logout(): boolean{

    localStorage.removeItem('current_user')
    localStorage.removeItem('profile')
    this.router.navigateByUrl('/')
     window.location.reload()
    return false

  }

}
