import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'entry-page',
        loadChildren: () => import('./entry-page/entry-page.module').then(module => module.EntryPageModule),
    },
    {
        path: '**',
        redirectTo: '/entry-page',
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]

})
export class AppRoutingModule {

}
