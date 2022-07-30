import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PortfolioDetailPageComponent } from './portfolio-detail-page/portfolio-detail-page.component';
import { StackComponent } from './stack/stack.component';

const routes: Routes = [
  { path: 'header-component', component: HeaderComponent },
  { path: '', component: GalleryComponent },
  { path: 'stack', component: StackComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: ':id', component: PortfolioDetailPageComponent }, // :id for project

  /* 404 wildcard, last entry */
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
