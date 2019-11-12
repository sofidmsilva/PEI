import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-all-tabs',
  templateUrl: './all-tabs.page.html',
  styleUrls: ['./all-tabs.page.scss'],
})
export class AllTabsPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    }
  }
}
