import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { AllTabsPage } from './all-tabs.page';
import {TabsPageRoutingModule} from './all-tabs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    TranslateModule
  ],
  declarations: [AllTabsPage]
})
export class AllTabsPageModule {}
