import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./explore-page.component').then((m) => m.ExplorePageComponent),
      },
    ]),
  ],
})
export class ExploreModule { }
