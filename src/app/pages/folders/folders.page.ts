import { Component, OnInit } from '@angular/core';
import { AudiosService } from '../../services/audios.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-folders',
  templateUrl: 'folders.page.html',
  styleUrls: ['folders.page.scss']
})
export class FoldersPage implements OnInit {

  checkboxes: boolean[] = [];

  constructor(
    public audiosS: AudiosService,
    public utilsS: UtilsService,
  ) {}


  ngOnInit(): void {
  }


}
