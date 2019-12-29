import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import { Favorites } from 'src/app/interfaces/favorites';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { toStringHDMS } from 'ol/coordinate';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {

  public profileid = this.router.url.split('/');
  private alluser = []
  private datafavorites = new Array<Favorites>();
  private FavoritesSubscription: Subscription;
  private userSubscription: Subscription;
  public NewUser;
  
  constructor(private router: Router,private userServices: RegisterService,
    private authServices: AuthService,private toastCrt: ToastController,) {

    this.FavoritesSubscription = this.userServices.getFavoritesfrom(this.authServices.getAuth().currentUser.uid).subscribe(
      data => {
        this.datafavorites = data 
        this.alluser=[];
        for(let i = 0; i <= this.datafavorites.length - 1; i++){   
          this.userSubscription = this.userServices.getDataUser(this.datafavorites[i].to).subscribe(
            data => {
              
              this.alluser[i] = data;
            });
          
        }
        
      });
   }

  ngOnInit() {
    this.NewUser = this.authServices.getAuth().currentUser.uid;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.FavoritesSubscription.unsubscribe();
    this.datafavorites=[];
    this.alluser=[]; 
}

  searchprofile(event) {
    this.router.navigate(['/tabs/profile', event]);
  }

  
  async RemoveFavorites(id:string){
    for(let i = 0; i <= this.datafavorites.length - 1; i++){
       if((id == this.datafavorites[i].to) && (this.NewUser==this.datafavorites[i].from)){
         var remove = this.datafavorites[i].id;
       }
    }
    try {
      await this.userServices.deletefavorites(remove);
    }
    catch (error) {
      console.error(error);
      this.presentToast('erro ao apagar');
    }
  }
  async presentToast(message: string) {
    const toast = await this.toastCrt.create({ message, duration: 2000 });
    toast.present();
  }
}
