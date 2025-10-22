import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboad/dashboad.module').then(m =>m.DashboadPageModule),
        canActivate:[AuthGuard]

      },
      {
        path: 'transactions/:account_id/:type',
        loadChildren: () => import('../pages/dashboad/transactions/transactions.module').then(m => m.TransactionsPageModule),
        canActivate:[AuthGuard]

      },
      {
        path: 'addbank',
        loadChildren: () => import('../pages/addbank/addbank.module').then(m => m.AddbankPageModule),
        canActivate:[AuthGuard]
        // loadChildren: () => import('./pages/addbank/addbank.module').then( m => m.AddbankPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule),
        canActivate:[AuthGuard]
        // loadChildren: () => import('./pages/addbank/addbank.module').then( m => m.AddbankPageModule)
      },
      {
        path: 't-history',
        loadChildren: () => import('../pages/transfer-history/transfer-history.module').then(m => m.TransferHistoryPageModule),
        canActivate:[AuthGuard]
        // loadChildren: () => import('./pages/addbank/addbank.module').then( m => m.AddbankPageModule)
      },
      {
        path: 'payeelist',
        loadChildren: () => import('../pages/payeelist/payeelist.module').then( m => m.PayeelistPageModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'startnewrd/:type',
        loadChildren: () => import('../pages/newrd/newrd.module').then( m => m.NewrdPageModule),
        canActivate:[AuthGuard]
        // loadChildren: () => import('../pages/payeelist/payeelist.module').then( m => m.PayeelistPageModule)
      },
      {
        path: 'success/:data',
        loadChildren: () => import('../pages/success/success.module').then( m => m.SuccessPageModule),
        canActivate:[AuthGuard]
        // loadChildren: () => import('../pages/payeelist/payeelist.module').then( m => m.PayeelistPageModule)
      },
      {
        path: 'changepassword',
        loadChildren: () => import('../pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
        canActivate:[AuthGuard]
      },

      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
