import { Injectable } from '@angular/core';
import { DB } from '../common/models/database-model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }


  public storeDB(db: DB): void {
    localStorage.setItem('database', JSON.stringify(db));
  }


  public loadDB(): DB {
    const db = JSON.parse(localStorage.getItem('database'));
    return db ? db : new DB();
  }

}
