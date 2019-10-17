import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'addfile', pathMatch: 'full' },
  {
    path: 'audios',
    loadChildren: () => import('./pages/audios/audios.module').then(m => m.AudiosPageModule)
  },
  {
    path: 'folders',
    loadChildren: () => import('./pages/folders/folders.module').then(m => m.FoldersPageModule)
  },
  {
    path: 'addfile',
    loadChildren: () => import('./pages/addfile/addfile.module').then(m => m.AddfilePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
