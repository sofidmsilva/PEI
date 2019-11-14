import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTabsPage } from './all-tabs.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
  {
    path: '',
    component: AllTabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: AllTabsPage,
    children: [
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: AllTabsPage,
    children: [
      {
        path: 'favorites',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../favorites/favorites.module').then(m => m.FavoritesPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
