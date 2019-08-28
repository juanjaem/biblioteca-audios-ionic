import { Component, OnInit } from '@angular/core';
import { AUDIOS } from '../common/constants/database';
import {Howl, Howler, } from 'howler';
import { IonRange } from '@ionic/angular';

// Estados de reproducción (AudiosEstates)
enum AE  {
  playing = 0,
  stopped = 1,
  paused = 2
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  audios;
  reordenar = true;

  // REPRODUCTOR DE AUDIO
  periodoDeRefresco: number = 50; // AJUSTE: Definirá el periodo de refresco (en ms) de la barra del reproductor.
  selectedAudio: Howl; // Guarda el audio seleccionado a reproducir
  audioDuration: number; // La duración del audio seleccionado
  interval; // Intervalo que hace que la barra del reproductor se mueva
  selectedSeek: number = 0; // Guarda la posición del ion-range seleccionada por el usuario
  rangePosition: number = 0; // La posición en la que está el ion-range (la barra del reproductor)
  rangeIsTouched_flag: boolean = false;
  AE = AE; // De esta forma AE queda accesibles al HTML
  audioState: AE = AE.stopped; // playing, paused, stopped

  constructor(  ) {}

  ngOnInit(): void {
    this.audios = AUDIOS;
  }


  // Reordenar pistas
  reorderConfigurationsList(ev) {
    ev.detail.complete();
  }


  // Reproducir nuevo audio
  async playNewAudio(fileName: string): Promise<void> {

    // Si hay algún fichero cargado, lo quitamos de la caché
    if (this.selectedAudio) {
      this.selectedAudio.unload();
    }

    // Si la barra del reproductor está moviendose, la paramos
    if (this.interval) {
      clearInterval(this.interval);
    }

    // Seleccionamos el fichero de audio
    this.selectedAudio = new Howl({
      src: [`./assets/audios/${fileName}`]
    });

    // Cargamos el fichero de audio y esperamos a que esté listo
    await new Promise((resolve) => {
      this.selectedAudio.once('load', () => {
        resolve();
      });
    });

    this.audioDuration = Number(this.selectedAudio.duration().toFixed(2));
    this.rangePosition = 0;
    this.selectedSeek = 0;
    this.audioState = AE.playing;

    this.runAutoAdjustSeekBar();
    this.selectedAudio.play();

    // Cuando termine de reproducirse el audio, pondrá el estado en 'stopped'
    this.selectedAudio.on('end', () => {
      console.log('Audio Finished!');
      this.audioState = AE.stopped;
    });
  }

  // Play-Pause para el botón del reproductor
  playPause(): void {
    if (this.audioState === AE.stopped) {
      this.audioState = AE.playing;
      this.selectedAudio.play();
      this.runAutoAdjustSeekBar();
      return;
    }

    if (this.audioState === AE.paused) {
      this.audioState = AE.playing;
      this.selectedAudio.play();
      this.runAutoAdjustSeekBar();
      return;
    }

    if (this.audioState === AE.playing) {
      this.audioState = AE.paused;
      this.selectedAudio.pause();
      this.stopAutoAdjustSeekBar();
      return;
    }
  }


  // Inicia y gestiona Gestiona el movimiento de la barra del reproductor
  private runAutoAdjustSeekBar(): void {
    this.interval = setInterval(() => {
      if (this.rangePosition > this.audioDuration) {
        // El audio ha terminado.
        this.selectedSeek = 0;
        this.rangePosition = 0;
        clearInterval(this.interval);
      }

      this.rangePosition = this.rangePosition + this.periodoDeRefresco / 1000; // Actualizar la posicion de la barra
    }, this.periodoDeRefresco);
  }


  // Parar el movimiento de la barra del reproductor
  private stopAutoAdjustSeekBar(): void {
    clearInterval(this.interval);
  }


  // Guardará la posición de la barra del reproductor seleccionada por el usuario
  rangeHasChanged(ev: any): void {
    if (!this.rangeIsTouched_flag) { return; } // Si no se trata de un cambio por pulsación del usuario, salir sin hacer nada

    console.log('rangeHasChanged');
    this.selectedSeek = ev.detail.value; // Guardamos la posición del audio seleccionada por el usuario
    this.selectedSeek = Number(this.selectedSeek.toFixed(2));
  }


  // Parará el movimiento de la barra del reproductor cuando el usuario empieza a tocarlo
  rangeTouchStart() {
    console.log('rangeTouchStart');
    this.rangeIsTouched_flag = true;
    this.stopAutoAdjustSeekBar();
  }


  // Cuando el usuario deja de pulsar la barra del reproductor, se cambia la posición del audio por la seleccionada por el usuario.
  rangeTouchEnd(ev) {
    console.log('rangeTouchEnd');

    // Esperamos un poco para que le de tiempo a entrar a rangeHasChanged() y actualice el valor de 'selectedSeek'
    setTimeout(() => {
      console.log('selectedSeek: ', this.selectedSeek);
      this.rangeIsTouched_flag = false;

      this.rangePosition = this.selectedSeek;
      this.selectedAudio.seek(this.selectedSeek);

      // Si estabamos en playing, ponemos la barra en movimiento
      if (this.audioState === AE.playing) {
        this.runAutoAdjustSeekBar();
      }
    }, 10);

  }


}
