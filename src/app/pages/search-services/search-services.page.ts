import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import Tile from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from "ol/source/OSM";
import View from "ol/View";
import { ServicespetService } from 'src/app/services/servicespet.service';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import TileJSON from 'ol/source/TileJSON';
import { TranslateService } from '@ngx-translate/core';
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
  // map;
  // @ViewChild('map', {static: false}) mapElement: ElementRef;
  @ViewChild('map', { static: false }) map;

  private userSubscription: Subscription;
  private filterUsers: Array<User>;
  private orderprice: Array<number>;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;
  public currentEmail: string;
  public userCoords: number[] = []
  currentLocation;
  vectorSource;
  vectorLayer;
  rasterLayer;

  constructor(private router: Router,
    private userServices: RegisterService, private service: ServicespetService, private storage: Storage) {
    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
        this.filterUsers = data;
      });
      route.params.subscribe(val => {
        this.filterUsers = Object.assign([], this.userServices.getUsersCollection());
      });
  }

  setUsers(data){
    this.filterUsers = data;
  }

  ngOnInit() {
    this.option = "relevance";
  }

  public initializeMap() {
    this.storage.get('currentActiveUser').then((userToken) => {
      this.service.getCoordsLocationOfAUser(userToken).then((resolve) => {


        //---------------------------------------MAIN MARKER---------------------------------
        this.map = new Map({
          target: 'map',
          layers: [new Tile({
            source: new OSM()
          })
          ],
          view: new View({
            center: fromLonLat([resolve.longitude, resolve.latitude]),
            zoom: 10
          })

        })

        var marker = new Feature({
          geometry: new Point(
            fromLonLat([resolve.longitude, resolve.latitude])
          ),
        });


        marker.setStyle(new Style({
          image: new Icon(({
            color: '#8959A8',
            crossOrigin: 'anonymous',
            src: 'assets/img/point-png-1.png',
            imgSize: [500, 500],
            scale: 0.09
          }))
        }))

        var vectorSource = new VectorSource({
          features: [marker]
        });


        var markerVectorLayer = new VectorLayer({
          source: vectorSource,
        });



        this.map.addLayer(markerVectorLayer);



        //---------------------------------------ALL THE OTHER MARKERS---------------------------------

        this.service.getCoordsLocationOfAllNearPetSitters(resolve.cidade).subscribe(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }
          snapshot.forEach(doc => {
            console.log(doc.id, '=>',doc.data());

            var marker = new Feature({
              geometry: new Point(
                fromLonLat([doc.data().morada.Coordenadas.longitude, doc.data().morada.Coordenadas.latitude])
              ),
            });
            marker.setStyle(new Style({
              image: new Icon(({
                crossOrigin: 'anonymous',
                src: 'assets/img/petsitter_icon.png',
                imgSize: [700, 800],
                scale: 0.05
              }))
            }))

            var vectorSource = new VectorSource({
              features: [marker]
            });


            var markerVectorLayer = new VectorLayer({
              source: vectorSource,
            });



            this.map.addLayer(markerVectorLayer);
          });
        });



      });

    })

  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.option;
  }

  searchprofile(event) {
    this.router.navigate(['/tabs/profile', event]);
  }

  openFilters(){
    this.router.navigate(['tabs/service-filters']);
  }
  goback(){
    this.router.navigate(['tabs/home']);
  }
}
