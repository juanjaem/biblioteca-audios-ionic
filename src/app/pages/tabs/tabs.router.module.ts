import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'audios',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../audios/audios.module').then(m => m.AudiosPageModule)
          }
        ]
      },
      {
        path: 'folders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../folders/folders.module').then(m => m.FoldersPageModule)
          }
        ]
      },
      {
        path: 'random',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../random/random.module').then(m => m.RandomPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/audios',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/audios',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
