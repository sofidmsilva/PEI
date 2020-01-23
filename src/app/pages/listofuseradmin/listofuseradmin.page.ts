import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listofuseradmin',
  templateUrl: './listofuseradmin.page.html',
  styleUrls: ['./listofuseradmin.page.scss'],
})
export class ListofuseradminPage{

  public users=[]

  constructor(private userServices: RegisterService,private router: Router) { }

  ionViewWillEnter(){
    this.getAllUserData();
  }
  getAllUserData(){
    this.userServices.getAllUser().subscribe(res=>{
      for (let index = 0; index < res.length; index++) {
        if(!res[index].image){
          res[index].image="../../../assets/img/computer-icons-user-profile-male-png-favpng-ZmC9dDrp9x27KFnnge0jKWKBs.jpg"
        }
        this.users.push(res[index])
        
      }
    })
  }

  deleteProfile(id:string){
    
    this.userServices.removeUser(id)

    
  }

}
