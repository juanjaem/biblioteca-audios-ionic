import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICIOS
import { AudiosService } from './audios.service';
import { UtilsService } from './utils.service';
import { SessionService } from './session.service';



@NgModule({
  providers: [
    AudiosService,
    UtilsService,
    SessionService,
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ServicesModule { }
