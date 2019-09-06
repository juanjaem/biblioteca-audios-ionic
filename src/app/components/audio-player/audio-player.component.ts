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


  AE = AE; // De esta forma AE queda accesibles al HTML
  showAdvancedPlayer: boolean = true;
  dpe: boolean = true;
  loopMode: boolean = false;
  audioState: AE = AE.stopped; // playing, paused, stopped
  playSpeed: number = 0;
  periodoDeRefresco: number = 50; // AJUSTE: Definirá el periodo de refresco (en ms) de la barra del reproductor.
  audioFileName: string;
  selectedAudio: Howl; // Guarda el audio seleccionado a reproducir
  audioDuration: number; // La duración del audio seleccionado
  interval: any; // Intervalo que hace que la barra del reproductor se mueva
  rangePosition: number = 0; // La posición en la que está el ion-range (la barra del reproductor)
  sliceRangeValues: {lower: number, upper: number} = {lower: 0, upper: 0};



  @Input() newAudioSelected = new EventEmitter<string>(); // Para indicar al componente que debe refrescar los usuarios del Site
  newAudioSelected_sus: Subscription;

  constructor( ) { }

  ngOnInit(): void {
    // Suscripción a nuevos ficheros a reproducir
    this.newAudioSelected_sus = this.newAudioSelected.subscribe(async (fileName: string) => {
      if (this.audioFileName !== fileName) {
        this.audioFileName = fileName;
        this.audioDuration = await this.getAudioDuration(fileName);
      }
      this.sliceRangeValues.lower = 0;
      this.sliceRangeValues.upper = this.audioDuration;
      this.loadAndPlayAudio();
    });
  }


  ngOnDestroy(): void {
    this.newAudioSelected_sus.unsubscribe();
  }


  async getAudioDuration(fileName: string): Promise<number> {
    const audio = new Howl({
      src: [`./assets/audios/${fileName}`]
    });

    await new Promise((resolve) => {
      audio.once('load', () => {
        resolve();
      });
    });

    audio.unload();

    return Number(audio.duration().toFixed(2));
  }


  // CARGA UN AUDIO CON LAS OPCIONES DE REPRODUCCIÓN DESEADAS
  async loadAndPlayAudio() {
    // Si hay algún fichero cargado, lo quitamos de la caché
    if (this.selectedAudio) {
      this.selectedAudio.unload();
    }

    // Si la barra del reproductor está moviendose, la paramos
    this.stopAutoAdjustSeekBar();

    // Seleccionamos el fichero de audio y el sprite
    this.selectedAudio = new Howl({
      src: [`./assets/audios/${this.audioFileName}`],
      sprite: { spriteValue: [this.sliceRangeValues.lower * 1000, (this.sliceRangeValues.upper - this.sliceRangeValues.lower) * 1000]}
    });

    // Cargamos el fichero de audio y esperamos a que esté listo
    this.dpe = true;
    await new Promise((resolve) => {
      this.selectedAudio.once('load', () => {
        resolve();
      });
    });
    this.dpe = false;

    this.rangePosition = this.sliceRangeValues.lower;
    this.runAutoAdjustSeekBar();
    this.audioState = AE.playing;
    this.selectedAudio.play('spriteValue');

    // Cuando termine de reproducirse el audio, pondrá el estado en 'stopped'
    this.selectedAudio.on('end', () => {
      console.log('END Event');

      this.stopAutoAdjustSeekBar();
      this.selectedAudio.stop();
      this.audioState = AE.stopped;
      this.rangePosition = this.sliceRangeValues.lower;

      // ¿Está habilitado el modo Bucle?
      if (this.loopMode) {
        this.loadAndPlayAudio();
      }
    });
  }


  // Play-Pause para el botón del reproductor
  playPause(): void {
    if (this.audioState === AE.stopped) {
      this.loadAndPlayAudio();
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
    this.stopAutoAdjustSeekBar();
  }


  // Cuando el usuario deja de pulsar la barra del reproductor, se cambia la posición del audio por la seleccionada por el usuario.
  rangeTouchEnd() {
    setTimeout(() => {
      this.selectedAudio.seek( Number(this.rangePosition.toFixed(2)) );

      // Si estabamos en playing, ponemos la barra en movimiento
      if (this.audioState === AE.playing) {
        this.runAutoAdjustSeekBar();
      }
    }, 20);
  }


  sliceTouchStart() {
    this.stopAutoAdjustSeekBar();
    this.selectedAudio.stop();
    if (this.audioState !== AE.playing) {
      this.audioState = AE.stopped;
    }
    this.rangePosition = 0;
  }


  sliceTouchEnd(): void {
    if (this.audioState === AE.playing) {
      setTimeout(() => {
        this.loadAndPlayAudio();
      }, 20);
    }

  }


  swichLoopMode() {
    this.loopMode = !this.loopMode;
  }

}
