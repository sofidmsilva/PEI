export interface Chat {
    from?: string;
    fromName?: string;
    messages?: Array<string>;
    to?: string;
    toName?: string;
    id?:number;
    service?:string;
}
