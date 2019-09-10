import { Component, OnInit, ViewChild } from '@angular/core';
import { AudiosService } from '../../services/audios.service';

@Component({
  selector: 'app-audios',
  templateUrl: 'audios.page.html',
  styleUrls: ['audios.page.scss']
})
export class AudiosPage implements OnInit {

  reordenar = true;

  @ViewChild('reproductor', {static: false}) reproductor: any;


  constructor(
    public audiosS: AudiosService,
  ) {}

  ngOnInit(): void {
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
