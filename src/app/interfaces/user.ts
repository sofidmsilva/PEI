import { Timestamp, Observable } from 'rxjs';
import { Morada } from './morada';

export interface User {
    id?: string;
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
    ratings?:number;
    // locationCity?:string;
    location?:string;
    morada?:Morada
    phonenumber?: number;
    image?: string;
    premium?:boolean;
    typeservice?:string;
 
    


}
