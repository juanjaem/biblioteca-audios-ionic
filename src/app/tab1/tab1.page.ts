import { Component, OnInit } from '@angular/core';
import { AUDIOS } from '../common/constants/database';
import {Howl, Howler} from 'howler';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  audios;
  reordenar = true;

  constructor(
    private nativeAudio: NativeAudio,
  ) {}

  ngOnInit(): void {
    this.audios = AUDIOS;
  }


  async reproducir(fileName) {
    const sound = new Howl({
      src: [`./assets/audios/${fileName}`]
    });

    sound.play();
  }

  reorderConfigurationsList(ev) {
    ev.detail.complete();
  }

}
