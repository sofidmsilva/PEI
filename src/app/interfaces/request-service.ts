export interface RequestService {
    id?:string;
    from?: string;
    to?: string;
    datebegin?: string;
    dateend?: string;
    datedone?: string;
    type?: string;
    accept?:number;
    done?:boolean;
    freeservice?:boolean
    location?:string;
    confirmmessgeto?:boolean;
    confirmmessgefrom?:boolean;
    ratingto?:boolean;
    ratingfrom?:boolean;
    payment?:boolean;
}
