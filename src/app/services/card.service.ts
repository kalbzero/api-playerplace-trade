import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  getCardByName: string = "https://api.magicthegathering.io/v1/cards?name=";
  getCardById: string = "https://api.magicthegathering.io/v1/cards/";
  getCardByForeignName: string = "&language=";

  constructor() { }
}
