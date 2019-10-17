import { AlertOptions } from '@ionic/core';
import { resolve } from 'url';

// SERVER ERRORS ALERT MESSAGES
export const SERVER_ERR_ALERT_MSGS: {[name: string]: AlertOptions} = {
    1: {
        header: 'Error interno',
        message: 'Ha habido algún problema en el servidor',
        buttons: ['OK']
    },
};


// ALERT MESSAGES
export const ALERT_MSGS: {[name: string]: AlertOptions} = {
    // ERRORES
    err_fileSaveFailure: {
        header: 'Fallo al guardar el archivo',
        buttons: ['OK']
    },
    err_fileOpeningFailure: {
        header: 'Fallo al abrir el archivo',
        buttons: ['OK']
    },

    // MENSAJES
    msg_imgFileToHeavy: {
        header: 'Imagen demasiado pesada',
        message: 'El máximo peso permitido es de 50MB',
        buttons: ['OK']
    },
};


