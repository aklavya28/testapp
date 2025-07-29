import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  data:any;
  private audio: HTMLAudioElement
  constructor(
    private route: ActivatedRoute,
    private router: Router

  ) {

  }

  ionViewWillEnter(){
    this.audio = new Audio();
    this.audio.src = 'assets/sound.mp3';
    this.playSound()
  }
  ngOnInit() {
    this.data = JSON.parse(this.route.snapshot.params['data'])
    // console.log(this.data)

  }

  playSound() {
    // Check if the audio is already playing and stop it
    this.audio.pause();
    this.audio.currentTime = 0;

    // Play the sound
    this.audio.play();
  }
  navigateToDashboard() {
  this.router.navigate(['/tabs/tabs/dashboard']).then(() => {
    window.location.reload();
  });
}
}
