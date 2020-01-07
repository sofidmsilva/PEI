import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { Filters } from 'src/app/interfaces/filters';
import { User } from 'src/app/interfaces/user';
import { ServicespetService } from 'src/app/services/servicespet.service';
import { Services } from 'src/app/interfaces/services';
@Component({
  selector: 'app-service-filters',
  templateUrl: './service-filters.page.html',
  styleUrls: ['./service-filters.page.scss'],
})
export class ServiceFiltersPage implements OnInit,OnDestroy {

  private userSubscription: Subscription;
  private ServicespetSubscription: Subscription;
  private alluser: Array<User>;
  private filterUsers: Array<User>;
  private servicesPet = new Array<Services>();
  private filterServicesPet = new Array<Services>();
  private filters : Filters = {};
  private stars: string[] = [];
  private typeanimals: Array<string> = ["TypeAnimals.cat", "TypeAnimals.dog", "TypeAnimals.turtle", "TypeAnimals.fish",
    "TypeAnimals.bird", "TypeAnimals.snake", "TypeAnimals.hamster"];

  constructor(private router: Router,
    private userServices: RegisterService, private servicespetServices : ServicespetService, route:ActivatedRoute) {
    this.userSubscription = this.userServices.getAllUser().subscribe(
      data => {
        this.alluser = data;
      });

    this.ServicespetSubscription = this.servicespetServices.getAllServices().subscribe(
      data => {
        this.servicesPet = data
        });
    route.params.subscribe(val => {
      this.filters.typeservice = this.servicespetServices.getServiceType();
    });
   }

  ngOnInit() { 
    for(let i =0; i<5 ; i++){
      this.stars.push("star-outline");
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  starClicked(index) {
    let experiencia = index+1;
    this.filters.experience = "<"+ experiencia;
    this.stars = [];
    for(let i =0; i<5 ; i++){
      this.stars.push("star-outline");
    }
    for(let i =0; i<=index ; i++){
      this.stars[i]= "star";
    }
  }
  cleanFilters(){
    this.filters = {};
    this.servicespetServices.setServiceType('');
    this.stars = [];
    for(let i =0; i<5 ; i++){
      this.stars.push("star-outline");
    }
    this.filterUsers = Object.assign([], this.alluser);
    this.servicespetServices.setFilterServicesCollection(this.servicesPet);
    this.userServices.setUsersCollection(this.filterUsers);
  }
  applyFilters(){
    this.filterUsers = Object.assign([], this.alluser);
    this.filterServicesPet = Object.assign([], this.servicesPet);
    if(this.filters.experience){
      this.filterUsers = this.filterUsers.filter(X => X.experience == this.filters.experience);
    }
    if(this.filters.garden){
      this.filterUsers = this.filterUsers.filter(X => X.garden == this.filters.garden);
    }
    if(this.filters.car){
      this.filterUsers = this.filterUsers.filter(X => X.car == this.filters.car);
    }
    if(this.filters.drivinglicense){
      this.filterUsers = this.filterUsers.filter(X => X.drivinglicense == this.filters.drivinglicense);
    }
    if(this.filters.typeservice){
      this.filterServicesPet = this.filterServicesPet.filter(X => X.typeservice == this.filters.typeservice);
      this.setUsersOfServices();
    }
    if(this.filters.AnimalType){
      var exist = false;
      for(let i =0; i < this.filterServicesPet.length; i++){
        exist= false;
        for(let j=0; j < this.filterServicesPet[i].typeanimals.length;j++){
          if(this.filters.AnimalType == this.filterServicesPet[i].typeanimals[j]){
            exist= true;
            break;
          }
        }
        if(!exist){
          this.filterServicesPet.splice(i,1);
          }
      }
      this.setUsersOfServices();
    }
    this.servicespetServices.setServiceType(this.filters.typeservice);
    this.servicespetServices.setFilterServicesCollection(this.filterServicesPet);
    this.userServices.setUsersCollection(this.filterUsers);
    this.router.navigate(['tabs/home/search-services']);
  }

  setUsersOfServices(){
    var exist = false;
    for(let i =this.filterUsers.length - 1; i>=0;i--){
      exist= false;
      for(let j=0; j < this.filterServicesPet.length;j++){
        if(this.filterUsers[i].id == this.filterServicesPet[j].userID){
          exist= true;
          break;
        }
      }
      if(!exist){
      this.filterUsers.splice(i,1);
      }
    }
  }
}
