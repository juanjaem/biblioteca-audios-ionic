import { Component, OnInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { Howl } from 'howler';
import { Subscription } from 'rxjs';

// Estados de reproducción (AudiosEstates)
enum AE  {
  playing = 0,
  stopped = 1,
  paused = 2
}

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {

  usingSprite_flag = false;
  showAdvancedPlayer: boolean = true;
  loopMode: boolean = true;
  loopMode_hasChanged: boolean = false;
  reloadIsNeeded: boolean = false;
  playSpeed: number = 0;
  periodoDeRefresco: number = 50; // AJUSTE: Definirá el periodo de refresco (en ms) de la barra del reproductor.
  audioFileName: string;
  selectedAudio: Howl; // Guarda el audio seleccionado a reproducir
  audioDuration: number; // La duración del audio seleccionado
  interval: any; // Intervalo que hace que la barra del reproductor se mueva
  rangePosition: number = 0; // La posición en la que está el ion-range (la barra del reproductor)
  AE = AE; // De esta forma AE queda accesibles al HTML
  audioState: AE = AE.stopped; // playing, paused, stopped
  sliceRangeValues: {lower: number, upper: number} = {lower: 0, upper: 0};


  @Input() newAudioSelected = new EventEmitter<string>(); // Para indicar al componente que debe refrescar los usuarios del Site
  newAudioSelected_sus: Subscription;

  constructor( ) { }

  ngOnInit(): void {
    // Suscripción a nuevos ficheros a reproducir
    this.newAudioSelected_sus = this.newAudioSelected.subscribe(async (fileName: string) => {
      this.audioFileName = fileName;
      this.loadAndPlayAudio(fileName, true);
    });
  }


  ngOnDestroy(): void {
    this.newAudioSelected_sus.unsubscribe();
  }


  // CARGA UN AUDIO CON LAS OPCIONES DE REPRODUCCIÓN DESEADAS
  async loadAndPlayAudio(fileName: string, isNewAudio = false) {

    // Si hay algún fichero cargado, lo quitamos de la caché
    if (this.selectedAudio) {
      this.selectedAudio.unload();
    }

    // Si la barra del reproductor está moviendose, la paramos
    if (this.interval) {
      clearInterval(this.interval);
    }

    let spriteValue: any = {};
    if (!isNewAudio) {
      spriteValue = {
        selectedSlice: [
          this.sliceRangeValues.lower * 1000,
          (this.sliceRangeValues.upper - this.sliceRangeValues.lower) * 1000
        ]
      };
      this.rangePosition = this.sliceRangeValues.lower;
      this.usingSprite_flag = true;
    }


    // Seleccionamos el fichero de audio y el sprite
    this.selectedAudio = new Howl({
      src: [`./assets/audios/${fileName}`],
      sprite: spriteValue,
      loop: this.loopMode
    });


    // Cargamos el fichero de audio y esperamos a que esté listo
    await new Promise((resolve) => {
      this.selectedAudio.once('load', () => {
        resolve();
      });
    });


    // Audio recién cargado
    if (isNewAudio) {
      this.audioDuration = Number(this.selectedAudio.duration().toFixed(2));
      this.sliceRangeValues.lower = 0;
      this.sliceRangeValues.upper = this.audioDuration;
      this.rangePosition = 0;
      this.audioState = AE.playing;
      this.runAutoAdjustSeekBar();
      this.selectedAudio.play();
    } else {
      if (this.audioState === AE.playing) {
        this.selectedAudio.play('selectedSlice');
        this.runAutoAdjustSeekBar();
      }
    }


    // Cuando termine de reproducirse el audio, pondrá el estado en 'stopped'
    this.selectedAudio.on('end', () => {
      console.log('END Event');

      this.stopAutoAdjustSeekBar();
      this.rangePosition = this.sliceRangeValues.lower;

      if (this.reloadIsNeeded) {
        this.reloadIsNeeded = false;
        this.loadAndPlayAudio(this.audioFileName);
        return;
      }

      // ¿Está habilitado el modo Bucle?
      if (this.loopMode) {
        // this.playLoadedAudio();
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.runAutoAdjustSeekBar();
        return;
      }

      this.selectedAudio.stop();
      this.audioState = AE.stopped;
      console.log('Audio Finished!');
    });

  }


  // Play-Pause para el botón del reproductor
  playPause(): void {
    if (this.audioState === AE.stopped) {
      this.reloadIsNeeded = false;
      this.audioState = AE.playing;
      this.loadAndPlayAudio(this.audioFileName);
      return;
    }

    if (this.audioState === AE.paused) {
      if (this.reloadIsNeeded) {
        this.audioState = AE.playing;
        this.reloadIsNeeded = false;
        this.loadAndPlayAudio(this.audioFileName);
        return;
      }
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

      this.rangePosition = this.rangePosition + this.periodoDeRefresco / 1000; // Actualizar la posicion de la barra
    }, this.periodoDeRefresco);
  }


  // Parar el movimiento de la barra del reproductor
  private stopAutoAdjustSeekBar(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  // Parará el movimiento de la barra del reproductor cuando el usuario empieza a tocarlo
  rangeTouchStart() {
    console.log('rangeTouchStart');
    this.stopAutoAdjustSeekBar();
  }


  // Cuando el usuario deja de pulsar la barra del reproductor, se cambia la posición del audio por la seleccionada por el usuario.
  rangeTouchEnd() {
    console.log('rangeTouchEnd');

    setTimeout(() => {
      this.selectedAudio.seek( Number(this.rangePosition.toFixed(2)) );

      // Si estabamos en playing, ponemos la barra en movimiento
      if (this.audioState === AE.playing) {
        this.runAutoAdjustSeekBar();
      }
    }, 20);
  }


  sliceTouchStart() {
    console.log('SliceTouchStart');
    this.selectedAudio.stop();
    this.stopAutoAdjustSeekBar();
    this.rangePosition = 0;
  }


  sliceTouchEnd(): void {
    if (this.audioState === AE.stopped || this.audioState === AE.paused) {
      this.reloadIsNeeded = true;
    } else {
      setTimeout(() => {
        this.loadAndPlayAudio(this.audioFileName);
      }, 20);
    }
  }

}
