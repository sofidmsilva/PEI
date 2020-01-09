import { Timestamp, Observable } from 'rxjs';
import { Morada } from './morada';

export interface UserPopUp {
    id?: string;
    telemovel?: string;
    name?: string;
    rua?:string
    numPorta?:number
    cidade?:string
    codigoPostal?:string

}
