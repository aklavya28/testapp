import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],

})
export class Tab2Page {

  constructor(
    private router: Router
  ) {}

  startNew(data:string){
    this.router.navigateByUrl("tabs/tabs/startnewrd/"+data);
  }


// async payUpi() {
//   // const upiUrl = `upi://pay?pa=devnidhi@sbi&pn=Dev Nidhi&am=100&cu=INR`;
//   const upiUrl = `com.google.android.apps.nbu.paisa.user`;

//   try {
//     const { value } = await AppLauncher.canOpenUrl({ url: upiUrl });

//     if (value) {
//       await AppLauncher.openUrl({ url: upiUrl });
//     } else {
//       alert('No UPI app found');
//     }
//   } catch (err) {
//     console.error('UPI Error:', err);
//   }
// }
async payUpi() {
  const upiUrl = `upi://pay?pa=devnidhi@sbi&pn=DEV RISING NIDHI LIMITED&am=1&cu=INR`;

  try {
    await AppLauncher.openUrl({ url: upiUrl });
  } catch (err) {
    console.error('UPI Error:', err);
    alert('Unable to open UPI app');
  }
}
}
