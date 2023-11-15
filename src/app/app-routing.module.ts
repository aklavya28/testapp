import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m=>m.LoginPageModule)
    // loadChildren: () => import('./pages/rxjs/rxjs-routing.module').then(m=> m.RxjsPageRoutingModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboad/dashboad.module').then( m => m.DashboadPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'transactions/:account_id/:type',
    loadChildren: () =>import('./pages/dashboad/transactions/transactions.module').then( m => m.TransactionsPageModule ),
    canActivate:[AuthGuard]
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  }





  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
