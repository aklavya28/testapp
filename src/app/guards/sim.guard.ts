import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HelperService } from '../services/helper.service';


@Injectable()
export class SimGuard implements CanActivate {
  constructor(private router: Router,private helper: HelperService){}
  canActivate(): boolean {
      if(localStorage.getItem('simVerified') == null){
           this.router.navigateByUrl('/sim-permission', { replaceUrl: true });
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
