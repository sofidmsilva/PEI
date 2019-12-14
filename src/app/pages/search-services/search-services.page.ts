import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { User } from 'firebase';
@Component({
  selector: 'app-search-services',
  templateUrl: './search-services.page.html',
  styleUrls: ['./search-services.page.scss'],
})
export class SearchServicesPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  private userSubscription: Subscription;
  private alluser: Array<User>;
  private orderprice: Array<number>;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;

  constructor(private router: Router,
    private userServices: RegisterService) {

    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
        this.alluser = data;
        console.log(this.alluser);
  
      });
   }

  ngOnInit() {
    this.option="relevance";
  }

  searchprofile(event) {
    console.log(event);
    this.router.navigate(['/tabs/profile', event]);
  }
}
