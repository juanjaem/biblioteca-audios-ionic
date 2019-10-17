import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Audio, Folder } from '../../common/models/database-model';
import { UtilsService } from '../../services/utils.service';
import { File as Filep, FileEntry } from '@ionic-native/file/ngx';
import { ALERT_MSGS } from '../../common/constants/alert-messages';
import { AlertOptions } from '@ionic/core';
import { AudiosService } from '../../services/audios.service';
import { DatabaseService } from '../../services/database.service';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-addfile',
  templateUrl: './addfile.page.html',
  styleUrls: ['./addfile.page.scss'],
})
export class AddfilePage implements OnInit {

  stdFiles: File[]; // Almacena los ficheros de audio seleccionados
  stdFiles_url: string[] = []; // Almacena la URL generada de los audios seleccionados
  audios: Audio[] = []; // Guarda todas los datos del los audios
  loaded_flag: boolean = false; // Indicará cuando se ha terminado de cargar toda la info de los audios seleccionados

  @ViewChild('reproductor', {static: false}) reproductor: any;
  @ViewChildren('ionSelect_folder') ionSelect_folder: QueryList<IonSelect>;

  constructor(
    public utilsS: UtilsService,
    public filep: Filep,
    public audiosS: AudiosService,
    public databaseS: DatabaseService,
  ) { }

  ngOnInit() {
  }


  // Gestionar fichero recién cargado
  async handleFileInput(fileList: FileList) {
    // Comprueba que llegue algo
    if (!fileList || fileList.length <= 0) {
      return;
    }
    this.loaded_flag = false;

    this.stdFiles = Object.values(fileList);

    let oneFileWasNotStd_flag = false;
    for (let j = 0; j < this.stdFiles.length; j++) {
      // Si un fichero no se elimina del array, controlamos la 'j' para que continuemos por el fichero que toca
      j = oneFileWasNotStd_flag ? j - 1 : j;
      oneFileWasNotStd_flag = false;

      const file = this.stdFiles[j];
      const reader = new FileReader();

      // Comprobar tamaño de los ficheros
      if (file.size > 52428800) { // 50MB 52428800
        const alert: AlertOptions = {
          header: 'Audio demasiado grande',
          message: `El fichero \'${file.name}\' tiene un tamaño de ${Math.round(file.size / 1048576)}MB.
            El tamaño máximo permitido es de 50MB. Este audio no será añadido`,
          buttons: ['OK']
        };

        const alerta = await this.utilsS.showAlert(alert);
        await alerta.onDidDismiss();

        this.stdFiles.splice(j, 1);
        console.error('Fichero demasiado grande. Se ha eliminado');
        oneFileWasNotStd_flag = true;
        continue;
      }

      // Generar una URL interna para acceder a los ficheros
      reader.readAsDataURL(file);
      await new Promise((resolve) => {
        reader.onload = () => {
          this.stdFiles_url.push( String(reader.result) );
          resolve();
        };
        reader.onerror = () => {
          console.error('Hubo un error al cargar los ficheros');
          this.stdFiles.splice(j, 1);
          oneFileWasNotStd_flag = true;
          resolve();
        };
      });

      this.audios[j] = new Audio();
    }

    this.loaded_flag = true;
  }


  // Reproduce el audio que le indiquemos
  sendAudioToPlayer(idx: number) {
    this.reproductor.newAudioSelected.emit(this.stdFiles_url[idx]);
  }


  async guardarAudio(idx) {
    console.log(this.audios[idx]);
    

    return

    const blob = new Blob([this.stdFiles[0]], { type: 'audio/ogg' });
    const filename = 'prueba';

    try {
      const fileEntry: FileEntry = await this.filep.writeFile(this.filep.externalCacheDirectory, filename, blob, {replace: true});
      console.log('Fichero creado correctamente: ', fileEntry);
    } catch (err) {
      console.error('Error al guardar el excel');
      console.error(err);
      this.utilsS.showAlert(ALERT_MSGS.err_fileSaveFailure);
    }
  }


  async showAlertAddFolder(idx: number) {
    const alertOptions: AlertOptions = {
      header: 'Crear carpeta',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Introduzca un nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Crear',
          handler: (value) => {
            if (value.hasOwnProperty('name') && value.name.length > 0) {

              // Añadir carpeta a la BD
              let folder: Folder;
              try {
                folder = this.databaseS.addFolder(value.name);
              } catch (err) {
                // MOSTRAR ALERT!!!!!!!!!!
                console.log(err);
                return;
              }

              // Seleccionar la carpeta creada en el ionSelect correspondiente
              this.ionSelect_folder.map((item, i) => {
                if (i === idx) {
                  item.value = folder.id;
                }
                return item;
              });
            }
          }
        }
      ]
    };

    this.utilsS.showAlert(alertOptions);
  }



  // async showAlertAddTag() {
  //   const alertOptions: AlertOptions = {
  //     header: 'Crear Tag',
  //     inputs: [
  //       {
  //         name: 'name',
  //         type: 'text',
  //         placeholder: 'Introduzca un nombre'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         cssClass: 'secondary'
  //       }, {
  //         text: 'Crear',
  //         handler: (value) => {
  //           if (value.hasOwnProperty('name') && value.name.length > 0) {
  //             // this.databaseS.add(value.name);
  //           }
  //         }
  //       }
  //     ]
  //   };

  //   this.utilsS.showAlert(alertOptions);
  // }

}
