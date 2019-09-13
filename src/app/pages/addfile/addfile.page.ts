import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addfile',
  templateUrl: './addfile.page.html',
  styleUrls: ['./addfile.page.scss'],
})
export class AddfilePage implements OnInit {

  stdFiles: FileList;

  constructor() { }

  ngOnInit() {
  }



  // Gestionar fichero recién cargado
  handleFileInput(files: FileList) {
    const reader = new FileReader();

    if (files && files.length > 0) {
      this.stdFiles = files;

      // Comprobar que el peso de la imagen no sea excesivo
      // this.stdFiles.forEach((file: Blob) => {
      //   if (file.size > 500000) {
      //     // this.utilsService.showAlert(ALERT_MSGS.msg_imgFileToHeavy);
      //     console.error('Fichero muy grande');
      //     return;
      //   }
      // });

      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   this.companyData.app_site_img = String(reader.result);
      //   console.log('Imagen precargada');
      // };
    }
  }

}
