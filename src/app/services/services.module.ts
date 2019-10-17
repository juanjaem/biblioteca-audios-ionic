import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICIOS
import { AudiosService } from './audios.service';
import { UtilsService } from './utils.service';
import { SessionService } from './session.service';
import { DatabaseService } from './database.service';



@NgModule({
  providers: [
    AudiosService,
    UtilsService,
    SessionService,
    DatabaseService,
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ServicesModule { }
