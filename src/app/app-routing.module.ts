import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  { path: 'tabs', loadChildren: ()=>import('./pages/all-tabs/all-tabs.module').then(m=>m.AllTabsPageModule),canActivate:[AuthGuard] },
  { path: 'login', loadChildren: ()=>import('./pages/login/login.module').then(m=>m.LoginPageModule),canActivate:[LoginGuard] },
  { path: 'language-popover', loadChildren: './pages/language-popover/language-popover.module#LanguagePopoverPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
