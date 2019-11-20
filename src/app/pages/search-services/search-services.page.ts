import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-services',
  templateUrl: './search-services.page.html',
  styleUrls: ['./search-services.page.scss'],
})
export class SearchServicesPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;

  constructor(private router: Router) {
   }

  ngOnInit() {
    this.option="relevance";
  }

  searchprofile() {
    this.router.navigate(['tabs/profile/:id']);
  }
}
