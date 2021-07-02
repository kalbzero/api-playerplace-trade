import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private urlSearchCardByName: string = "https://api.magicthegathering.io/v1/cards?name=";
  private urlCardById: string = "https://api.magicthegathering.io/v1/cards/";
  private getCardByForeignName: string = "&language=";

  constructor(private http: HttpClient) { }

  getCardById(id: string): Observable<any>{
    return this.http.get<any>(this.urlCardById + id);
  }
  searchCard(name: string): Observable<any[]>{
    return this.http.get<any[]>(this.urlSearchCardByName + name);
  }
}
