import { Component, OnInit } from '@angular/core';

import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.page.html',
  styleUrls: ['./rxjs.page.scss'],
})
export class RxjsPage implements OnInit {
  agent: Observable<string> | undefined;
  agentNames:string[] = [];
  constructor() { }

  ngOnInit() {

//  let  d =  of(1, 2, 3)
//   .pipe(map((x) => x  ));
//   d.subscribe((v) => console.log(`value: ${v}`));




  this.agent = new Observable(
    function(data){
      try{
        data.next("ram")


          data.next("shayam")

        setInterval(()=> {

          data.next("sita")
        }, 6000)
      }catch(e){
      //  console.log(e)
      }
    }
  )
    this.agent.subscribe(data =>{
      // console.log(data)
      this.agentNames.push(data)
    })
    console.log (this.agentNames)
  }


}
