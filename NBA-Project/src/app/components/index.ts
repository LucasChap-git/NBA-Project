import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Header } from './header/header.component';
import { DailyLines } from './daily-line/daily-lines';
import { WelcomeCard } from './welcome-card/welcome-card';
import { TopLines } from './top-lines/top-lines';

@Component({
  selector: 'app-index-page',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [
    SideNavComponent,
    RouterModule,
    Header,
    TopLines,
    DailyLines,
    WelcomeCard,
    RouterOutlet,
],
})
export class IndexPage {

}