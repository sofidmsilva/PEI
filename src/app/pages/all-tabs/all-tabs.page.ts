import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController, IonTabs } from '@ionic/angular';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import {   Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-all-tabs',
  templateUrl: './all-tabs.page.html',
  styleUrls: ['./all-tabs.page.scss'],
})
export class AllTabsPage implements OnInit {


  public userId: string;
  constructor(private authService: AuthService, 
    private popoverCtr:PopoverController,
    private route: Router,
    private storage: Storage) { 

  }

  ngOnInit() {
  }

  searchuser(){
    this.userId = this.authService.getAuth().currentUser.uid;
    this.route.navigate(['/tabs/profile',this.userId]);
  }
  async logout() {
    try {
      await this.authService.logout();
      this.storage.remove('currentActiveUser')
    } catch (error) {
      console.error(error);
    }
  }
  async openlanguages(ev) { 
    const popover=await this.popoverCtr.create({
      component: LanguagePopoverPage,
      event:ev
    });
    await popover.present();
  }

  ngOnDestroy(){}

}
