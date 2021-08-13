import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperServiceService {

  private site = Array<any>();

  //public customSite= this.site.asObservable();

  constructor() { }

  // public getSites(site: Sitio): void{
    //this.site.next(site);
  // }
}
