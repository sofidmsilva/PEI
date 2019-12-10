import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { UserregisterPage } from './userregister.page';
import { AutoCompleteModule } from 'ionic4-auto-complete';

const routes: Routes = [
  {
    path: '',
    component: UserregisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AutoCompleteModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserregisterPage]
})
export class UserregisterPageModule {}
