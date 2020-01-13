import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import Tile from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from "ol/source/OSM";
import View from "ol/View";
import { ServicespetService } from 'src/app/services/servicespet.service';
import { Feature, Overlay } from 'ol';
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
import { toStringHDMS } from 'ol/coordinate';
import { UserPopUp } from 'src/app/interfaces/userPopUp';
import { User } from 'src/app/interfaces/user';

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

  private filterUsers: Array<User>;
  private orderprice: Array<number>;
  public animalsPosition: number = 0;
  public animalsDifference: number = 100;
  public option: string;
  public currentEmail: string;
  public userCoords: number[] = []
  public userPopUpInfo: UserPopUp = {};
  public alldatauser:any;
  currentLocation;
  vectorSource;
  vectorLayer;
  rasterLayer;

  constructor(private router: Router,
    private userServices: RegisterService, private service: ServicespetService, private storage: Storage, route:ActivatedRoute) {
      this.filterUsers = Object.assign([], this.userServices.getUsersCollection());
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
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    // container.addEventListener("click", (e:Event) => this.verPerfil());
   
    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.storage.get('currentActiveUser').then((userToken) => {
    this.service.getCoordsLocationOfAUser(userToken).then((resolve) => {
      

        //---------------------------------------MAIN MARKER---------------------------------
        this.map = new Map({
          target: 'map',
          layers: [new Tile({
            source: new OSM()
          })
          ],
          overlays:[overlay],
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

        this.map.on("singleclick", e=> {
          var feature=this.map.forEachFeatureAtPixel(e.pixel, function (feature) {
            return feature;
          });
          if(feature){
            const coordinate = e.coordinate;
            // const hdms = toStringHDMS(toLonLat(coordinate));
            //console.log(hdms)

            overlay.setPosition(coordinate);
            this.showPopUpInfo(toLonLat(coordinate))
          }
      });
        // pointermove
        // this.map.addEventListener("click", (e:Event) => this.verPerfil());
        // this.map.on('singleclick', function (evt: any) {
          
        //   const coordinate = evt.coordinate;
        //   console.log(toLonLat(coordinate));
          
        //   const hdms = toStringHDMS(toLonLat(coordinate));
        //   //this.getUserFromCoords(coordinate[0],coordinate[1]);
        //   // content.innerHTML = "<p>Current coordinates are :</p><code>" + hdms +"</code>";
        //   // content.innerHTML += "<button type='button' id='seeProfile' (click)='verPerfil()'>Ver Perfil</button>"

        //   overlay.setPosition(coordinate);
        //   // let btn = document.getElementById("seeProfile");
        //   // btn.addEventListener("click", (e:Event) => this.verPerfil());
        // });

     


        closer.onclick = function () {
          overlay.setPosition(undefined);
          closer.blur();
          return false;
        };

        var vectorSource = new VectorSource({
          features: [marker]
        });


        var markerVectorLayer = new VectorLayer({
          source: vectorSource,
        });



        this.map.addLayer(markerVectorLayer);
        console.log(this.map)


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
  showPopUpInfo(coordinates:any){
    console.log(toStringHDMS(coordinates))
    this.service.showPopUpInfo(coordinates[0], coordinates[1]).subscribe(resp=>{
      console.log("Resp",resp.docs[0].data())
      this.userPopUpInfo.id=resp.docs[0].id;
      this.userPopUpInfo.rua=resp.docs[0].data().morada.Rua;
      this.userPopUpInfo.numPorta=resp.docs[0].data().morada.NumPorta;
      this.userPopUpInfo.name=resp.docs[0].data().name;
      this.userPopUpInfo.codigoPostal=resp.docs[0].data().morada.CodigoPostal;
      this.userPopUpInfo.cidade=resp.docs[0].data().morada.Cidade;
      this.userPopUpInfo.distrito=resp.docs[0].data().morada.Distrito;
      if(resp.docs[0].data().image){
        console.log("PASSOU NO IF")
        this.alldatauser=resp.docs[0].data().image;
      }
      else{
        console.log("PASSOU NO ELSE")
        this.alldatauser==false
      }
      console.log(this.userPopUpInfo)
    })
  }
  sortBy(filter){
    var usersList = [];
    var servicesList = this.service.getFilterServicesCollection();
    switch (filter) {
      case 'relevance':
        for(let i = 0; i < servicesList.length; i++){
          for(let j = 0; j < this.filterUsers.length; j++){
            if(this.filterUsers[j].id == servicesList[i].userID){
              this.filterUsers[j].typeservice = servicesList[i].typeservice;
              var userToAdd = Object.assign([], this.filterUsers[j]);
              usersList.push(userToAdd);
              break;
            }
          }
        }
        return usersList.filter(X => X.premium == true);
        break;
      case 'distance':
        for(let i = 0; i < servicesList.length; i++){
          for(let j = 0; j < this.filterUsers.length; j++){
            if(this.filterUsers[j].id == servicesList[i].userID){
              this.filterUsers[j].typeservice = servicesList[i].typeservice;
              var userToAdd = Object.assign([], this.filterUsers[j]);
              usersList.push(userToAdd);
              break;
            }
          }
        }
        return usersList.filter(X => X.morada.Cidade == this.userServices.getCurrentUser()[0].morada.Cidade);
        break;
      case 'price':
        servicesList = servicesList.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        for(let i = 0; i < servicesList.length; i++){
          for(let j = 0; j < this.filterUsers.length; j++){
            if(this.filterUsers[j].id == servicesList[i].userID){
              this.filterUsers[j].typeservice = servicesList[i].typeservice;
              var userToAdd = Object.assign([], this.filterUsers[j]);
              usersList.push(userToAdd);
              break;
            }
          }
        }
        return usersList;
        break;
      default:
        return this.filterUsers;
        break;
    }
  }
}
