import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Header } from './header/header.component';
import { ApiData, TopScorer } from '../services/api.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TopScorers } from './top-scorers/top-scorers';
import { DailyLines } from './daily-line/daily-lines';
import { WelcomeCard } from './welcome-card/welcome-card';

@Component({
  selector: 'app-index-page',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [
    SideNavComponent,
    RouterModule,
    Header,
    TopScorers,
    DailyLines,
    WelcomeCard,
],
})
export class IndexPage {

}