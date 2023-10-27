import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(): boolean {
      if(localStorage.getItem('current_user') == null){
          console.log("sunil null: " + localStorage.getItem('current_user'))
           this.router.navigateByUrl('/')
           return false;

      }
      return true
  }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

}
