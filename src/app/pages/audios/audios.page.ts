import { Component, OnInit, ViewChild } from '@angular/core';
import { AUDIOS_DB } from '../../common/constants/database';
@Component({
  selector: 'app-audios',
  templateUrl: 'audios.page.html',
  styleUrls: ['audios.page.scss']
})
export class AudiosPage implements OnInit {

  audios_db;
  reordenar = true;

  @ViewChild('reproductor', {static: false}) reproductor: any;


  constructor(  ) {}

  ngOnInit(): void {
    this.audios_db = AUDIOS_DB;
  }


  // Reordenar pistas
  reorderConfigurationsList(ev) {
    ev.detail.complete();
  }

  // Reproduce el audio que le indiquemos
  sendAudioToPlayer(fileName: string) {
    this.reproductor.newAudioSelected.emit(fileName);
  }

}
