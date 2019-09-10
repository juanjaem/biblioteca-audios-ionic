import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { SessionService } from './session.service';
import { DB } from '../common/models/database-model';

@Injectable({
  providedIn: 'root'
})
export class AudiosService {

  db: DB = new DB();

  constructor(
    public utilsS: UtilsService,
    public sessionS: SessionService,
  ) {
    this.db = this.sessionS.loadDB();
  }



}
