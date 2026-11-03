import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-index-page',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [
    SideNavComponent,
    RouterModule,
  ],
})
export class IndexPage {

}