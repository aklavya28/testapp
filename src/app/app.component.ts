import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements DoCheck{
  current_url:string =''
  current_user:any;
  fingerprint:any;
  top:string='';

  public appPages = [
    {
      title: 'Dashboad',
      url: "/tabs/tabs/dashboard", icon: 'grid'
    },
    {
      title: 'Pay',
      url: "/tabs/tabs/tab1", icon: 'card'
    },
    {
      title: 'Add Bank',
      url: "/tabs/tabs/addbank", icon: 'color-filter'
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


    //

    ) {

    router.events.subscribe((event) =>{
      // console.log(event)
      if (event instanceof NavigationEnd ) {

        // your code will goes here
        this.current_url = event.url;
        localStorage.setItem('current_url', JSON.stringify(this.current_url))

      }

    })

  }
  ionViewWillLeave() : void {
   localStorage.removeItem('current_user')
  }
  async ngOnInit(){
    let {isActive} = await App.getState();



   if(this.platform.is('android')){
      // this.top = "top: 30px"
      if(isActive){
        alert("status")
        // localStorage.removeItem('current_user')
      }
      StatusBar.setOverlaysWebView({ overlay: false })


    }


    // console.log(this.fp)

    // alert(JSON.parse(v))



  }
  ngDoCheck( ){
    // console.log("som is good man")
    this.current_user = localStorage.getItem('current_user')
  }
 logout(): boolean{

    localStorage.removeItem('current_user')
    this.router.navigateByUrl('/')
     window.location.reload()
    return false

  }


}
// document.addEventListener('destroy', function () {
//   // your JS code here!
//   localStorage.removeItem('current_user')
// });
