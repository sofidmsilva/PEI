import { Timestamp } from 'rxjs';

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
    location?:string;
    phonenumber?: number;
 
    


}
