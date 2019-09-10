import { Injectable } from '@angular/core';
import { cloneDeep, clone } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


    // Clonación profunda
    cloneDeep<T>(object: T) {
      return cloneDeep(object);
    }


    // Colonacion superficial
    cloneShallow<T>(object: T ) {
      return clone(object);
    }
}
