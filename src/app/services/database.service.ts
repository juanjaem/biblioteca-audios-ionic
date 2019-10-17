import { Injectable, OnInit } from '@angular/core';
import { Database, Folder } from '../common/models/database-model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db_mod: Database;

  constructor() {
    this.db_mod = new Database();
  }


  public addFolder(name: string): Folder {
    // Comprobar que no existe ya una carpeta con este nombre
    for (const folder of this.db_mod.folders) {
      if (folder.name === name) {
        throw new Error('Ya existe una carpeta con este nombre');
      }
    }

    const newFolder = new Folder();
    newFolder.name = name;
    newFolder.id = Date.now();
    this.db_mod.folders.push(newFolder);
    return newFolder;
  }







}
