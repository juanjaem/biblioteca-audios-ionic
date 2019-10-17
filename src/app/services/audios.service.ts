import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AudiosService {


  constructor(
    public utilsS: UtilsService,
    public sessionS: SessionService,
  ) {}

}
