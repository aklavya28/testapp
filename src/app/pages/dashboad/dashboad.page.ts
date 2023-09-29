import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboad',
  templateUrl: './dashboad.page.html',
  styleUrls: ['./dashboad.page.scss'],
})
export class DashboadPage implements OnInit {
  userdata = localStorage.getItem('cu')

  constructor() { }

  ngOnInit() {
  }

}
