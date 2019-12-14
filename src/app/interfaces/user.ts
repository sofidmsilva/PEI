import { Timestamp, Observable } from 'rxjs';

export interface User {
    email?: string;
    password?: string;
    sexo?: string;
    name?: string;
    tipoutilizador?: number;
    verifycode?: number;
    verify?:boolean;
    drivinglicense?:string;
    experience?:string;
    garden?:string;
    surface?:string;
    car?:string;
    dateofbirthday?:Date;
    locationCity?:string;
    locationCords?:{
        latitude:string
        longitude:string
    }
    phonenumber?: number;
    image?: string;
 
    


}
