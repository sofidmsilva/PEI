import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
declare var google;
@Component({
  selector: 'app-search-services',
  templateUrl: './search-services.page.html',
  styleUrls: ['./search-services.page.scss'],
})
export class SearchServicesPage implements OnInit, AfterViewInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  map;
  @ViewChild('map', {static: false}) mapElement: ElementRef;

  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;

  constructor(private router: Router) {
   }

  ngOnInit() {
    this.option="relevance";
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
  }

  searchprofile() {
    this.router.navigate(['tabs/profile/:id']);
  }
}
