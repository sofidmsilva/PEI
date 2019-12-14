import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import Map from 'ol/Map'
import Tile from 'ol/layer/Tile';
import OSM from "ol/source/OSM";
import View from "ol/View";
import {fromLonLat} from 'ol/proj';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-search-services',
  templateUrl: './search-services.page.html',
  styleUrls: ['./search-services.page.scss'],
})
export class SearchServicesPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  // map;
  // @ViewChild('map', {static: false}) mapElement: ElementRef;
   @ViewChild('map', {static: false}) map;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;
  public currentEmail:string;
  
  constructor(private router: Router, private service:ServicespetService, private storage: Storage) {
   }

  ngOnInit() {
    this.option="relevance";  
  }

  ngAfterViewInit(): void {
    this.initializeMap()
  }

  public initializeMap(){
    this.map=new Map({
      target:'map',
      layers:[
        new Tile({
          source: new OSM()
        })
      ],
      view:new View({
        center:fromLonLat([-8.3634059,41.2359759]),
        zoom:10
      })

    })
  }

  searchprofile() {
    this.router.navigate(['tabs/profile/:id']);
  }

  getCoordsLocationOfAUser(){
    this.storage.get('currentActiveUser').then((val)=>{
      this.currentEmail=val
  })
    this.service.getCoordsLocationOfAUser(this.currentEmail);
  }

  
}
