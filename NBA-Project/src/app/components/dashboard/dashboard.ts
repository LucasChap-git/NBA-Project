import { Component } from '@angular/core';
import { DailyLines } from '../daily-line/daily-lines';
import { MatchAside } from '../match-aside/match-aside';
import { SectionTitle } from '../section-title/section-title';
import { WelcomeCard } from '../welcome-card/welcome-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    DailyLines, 
    MatchAside, 
    SectionTitle, 
    WelcomeCard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly #date = new Date();

  //For section title
  readonly formattedDateForTitle = this.#date
      .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      .toUpperCase();
}
