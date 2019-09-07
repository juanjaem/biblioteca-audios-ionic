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

  AE = AE; // De esta forma el enum AE queda accesibles al HTML
  audioState: AE = AE.stopped; // Estado de la reproducción: playing, paused, stopped
  showAdvancedPlayer: boolean = true; // Mostrar/ocultar reproductor avanzado
  sliceTouchStart_flag: boolean = true;
  dpe: boolean = true; // Cuando está activo, bloquea la pulsación de todo lo que contiene el reproductor
  loopMode: boolean = false; // Habilitar/deshabilitar modo bucle
  playSpeed: number = 1; // Velocidad de reproducción
  audioFileName: string; // Guarda el nombre del fichero de audio a reproducir
  selectedAudio: Howl; // Guarda el audio seleccionado a reproducir
  audioDuration: number; // La duración del audio seleccionado
  periodoDeRefresco: number = 50; // Define el periodo de refresco (en ms) de la barra del reproductor.
  interval: any; // Intervalo que hace que la barra del reproductor se mueva
  rangePosition: number = 0; // La posición en la que está el ion-range (la barra del reproductor)
  sliceRangeValues: {lower: number, upper: number} = {lower: 0, upper: 0}; // Porción de audio a reproducir

  @Input() newAudioSelected = new EventEmitter<string>(); // A traves de aquí recibimos la orden de reproducir un nuevo audio
  newAudioSelected_sus: Subscription;

  constructor( ) { }

  ngOnInit(): void {
    // Suscripción a nuevos ficheros a reproducir
    this.newAudioSelected_sus = this.newAudioSelected.subscribe(async (fileName: string) => {
      // ?Estamos intentando cargar el mismo fichero que había cargado?
      if (this.audioFileName !== fileName) {
        if (this.selectedAudio) {
          this.selectedAudio.unload();
        }
        this.stopAutoAdjustSeekBar();
        this.audioFileName = fileName;
        this.audioDuration = await this.getAudioDuration(fileName);
      }

      this.sliceRangeValues = {lower: 0, upper: this.audioDuration};
      this.rangePosition = 0;

      this.loadAndPlayAudio();
    });
  }


  ngOnDestroy(): void {
    this.newAudioSelected_sus.unsubscribe();
  }


  // Obtiene la duración del audio a cargar
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


  // CARGA UN AUDIO CON LAS OPCIONES DE REPRODUCCIÓN DESEADAS Y LO REPRODUCE
  async loadAndPlayAudio() {
    this.dpe = true; // Deshabilitar controles del reproductor mientras cargamos el fichero de audio

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
    await new Promise((resolve) => {
      this.selectedAudio.once('load', () => {
        resolve();
      });
    });

    if (this.rangePosition === this.sliceRangeValues.upper) {
      // La barra de reproduccion se encontraba al final. Eso significa que se encuentra finalizado el audio.
      // Empezamos a reproduccir desde el valor más bajo del slice
      this.rangePosition = this.sliceRangeValues.lower;
      this.runAutoAdjustSeekBar();
      this.audioState = AE.playing;
      this.selectedAudio.play('spriteValue');
    } else {
      // La barra de reproducción se encontraba en el inicio, o un lugar seleccionado. Conservamos esta posicion
      // y empezamos a reproducir desde ahí
      this.runAutoAdjustSeekBar();
      this.audioState = AE.playing;
      this.selectedAudio.play('spriteValue');
      this.selectedAudio.seek( Number(this.rangePosition.toFixed(2)) );
    }

    this.selectedAudio.rate(this.playSpeed);
    this.dpe = false; // Volvemos a habilitar los controles del reproductor

    // Cuando termine de reproducirse el audio, pondrá el estado en 'stopped'
    this.selectedAudio.on('end', () => {
      this.stopAutoAdjustSeekBar();
      this.selectedAudio.stop();
      this.audioState = AE.stopped;
      this.rangePosition = this.sliceRangeValues.upper; // Con esto indicaremos que el audio se encontraba finalizado

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
      this.rangePosition = this.rangePosition + this.playSpeed * this.periodoDeRefresco / 1000; // Actualizar la posicion de la barra
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
    this.selectedAudio.pause();
  }


  // Cuando el usuario deja de pulsar la barra del reproductor, se cambia la posición del audio por la seleccionada por el usuario.
  rangeTouchEnd() {
    setTimeout(() => {
      this.selectedAudio.seek( Number(this.rangePosition.toFixed(2)) );

      // Si estabamos en playing, ponemos la barra en movimiento
      if (this.audioState === AE.playing) {
        this.runAutoAdjustSeekBar();
        this.selectedAudio.play();
      }
    }, 10);
  }


  sliceTouchStart() {
    if (this.sliceTouchStart_flag) { return; } // Con esto eviamos ejecutar mientras se desliza el ion-range

    this.sliceTouchStart_flag = true;
    this.stopAutoAdjustSeekBar();
    this.selectedAudio.stop();
    this.rangePosition = 0;
  }


  sliceTouchEnd(): void {
    this.sliceTouchStart_flag = false;

    setTimeout(() => {
      this.rangePosition = this.sliceRangeValues.lower;
      if (this.audioState === AE.playing) {
        this.loadAndPlayAudio();
      } else {
        this.audioState = AE.stopped;
      }
    }, 10);
  }


  changeSpeed() {
    setTimeout(() => {
      this.selectedAudio.rate(this.playSpeed);
    }, 10);
  }

}
