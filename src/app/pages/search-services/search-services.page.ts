import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import Tile from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from "ol/source/OSM";
import View from "ol/View";
import { ServicespetService } from 'src/app/services/servicespet.service';


@Component({
  selector: 'app-search-services',
  templateUrl: './search-services.page.html',
  styleUrls: ['./search-services.page.scss'],
})
export class SearchServicesPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  // map;
  // @ViewChild('map', {static: false}) mapElement: ElementRef;
  @ViewChild('map', { static: false }) map;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;
  public currentEmail: string;
  public userCoords: number[] = []

  constructor(private router: Router, private service: ServicespetService, private storage: Storage) {
  }

  ngOnInit() {
    this.option = "relevance";
  }

  ngAfterViewInit(): void {
    this.initializeMap()
  }

  public initializeMap() {
    this.storage.get('currentActiveUser').then((userToken) => {
      this.service.getCoordsLocationOfAUser(userToken).then((resolve) => {
        this.map = new Map({
          target: 'map',
          layers: [
            new Tile({
              source: new OSM()
            })
          ],
          view: new View({
            center: fromLonLat([resolve.longitude, resolve.latitude ]),
            zoom: 10
          })
    
        })
     });

   })
   
  }

  searchprofile() {
    this.router.navigate(['tabs/profile/:id']);
  }

}
