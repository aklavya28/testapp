import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  current_url:string =''
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


    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },

  ];


  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor( private router: Router) {

    router.events.subscribe((event) =>{
      // console.log(event)
      if (event instanceof NavigationEnd ) {

        // your code will goes here
        this.current_url = event.url;
        localStorage.setItem('current_url', JSON.stringify(this.current_url))

      }

    })

  }
  ngOnInit(){


  }
 logout(): boolean{

    localStorage.removeItem('current_user')
    this.router.navigateByUrl('/')
     window.location.reload()
    return false

  }

}
