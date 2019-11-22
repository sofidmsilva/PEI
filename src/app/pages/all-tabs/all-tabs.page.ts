import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController } from '@ionic/angular';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';

@Component({
  selector: 'app-all-tabs',
  templateUrl: './all-tabs.page.html',
  styleUrls: ['./all-tabs.page.scss'],
})
export class AllTabsPage implements OnInit {

  private userId: string;
  constructor(private authService: AuthService, private popoverCtr:PopoverController) { 
  }

  ngOnInit() {
    this.userId = this.authService.getAuth().currentUser.uid;
  }
  async logout() {
    try {
      await this.authService.logout();
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
}
