import { Injectable } from '@angular/core';
import { cloneDeep, clone } from 'lodash';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AlertOptions, LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  alertElement: HTMLIonAlertElement;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private toastController: ToastController,
  ) { }


  // Comprueba que esté en un dispositivo movil
  public CheckPlatformCordova(): boolean {
    if ( !this.platform.is('cordova') ) {
      console.log('Cordova no disponible');
      return false;
    }
    return true;
  }


  // Comprueba que esté en un dispositivo con iOS
  public CheckPlatformIos(): boolean {
    if ( !this.platform.is('ios') ) {
      return false;
    }
    return true;
  }


  // Comprueba que esté en un dispositivo con Android
  public CheckPlatformAndroid(): boolean {
    if ( !this.platform.is('android') ) {
      return false;
    }
    return true;
  }


  // ION-ALERT: Muestra Ion-Alert con la configuración que se le pase
  public async showAlert(alertOptions: AlertOptions): Promise<HTMLIonAlertElement> {
    if (this.alertElement) {
      await this.alertElement.dismiss(); // Si se está mostrando un alert, lo cierra antes de abrir el nuevo
    }

    this.alertElement = await this.alertController.create(alertOptions);
    await this.alertElement.present();
    return this.alertElement;
  }


  // ION-TOAST: Muestra Ion-Toast con la configuración que se le pase
  public async presentToast(opciones: any): Promise<void> {
    const toast = await this.toastController.create(opciones);
    toast.present();
  }


  // ION-LOADING. Muestra un Ion-Loading con la configuración que se le pase
  public async showLoading(loadingOptions?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    if (!loadingOptions) {
      loadingOptions = { // Default loadingOptions
        spinner: 'bubbles',
        message: 'Por favor, espere...',
        translucent: false
      };
    }
    const loading: HTMLIonLoadingElement = await this.loadingController.create(loadingOptions);
    await loading.present();
    return loading;
  }


  // Clonación profunda
  cloneDeep<T>(object: T) {
    return cloneDeep(object);
  }


  // Colonacion superficial
  cloneShallow<T>(object: T ) {
    return clone(object);
  }

}
