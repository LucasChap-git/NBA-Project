import { Component, inject } from '@angular/core';
import { ApiData, DailyLeaderKey, DailyStatProperty } from '../../services/api.service';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

interface StatisticConfig {
  key: DailyLeaderKey;
  title: string;
  property: DailyStatProperty;
  label: string;
}

@Component({
  selector: 'app-daily-lines',
  imports: [
    AsyncPipe,
  ],
  templateUrl: './daily-lines.html',
  styleUrl: './daily-lines.scss',
})
export class DailyLines {
  //Injecting API service
  readonly #apiUrl = inject(ApiData);

  //Satistics titles
  readonly statistics: readonly StatisticConfig[] = [
    { key: 'PTS', title: 'Points', property: 'pts', label: 'Pts' },
    { key: 'REB', title: 'Rebounds', property: 'reb', label: 'Reb' },
    { key: 'AST', title: 'Assists', property: 'ast', label: 'Ast' },
    { key: 'STL', title: 'Steals', property: 'stl', label: 'Stl' },
    { key: 'BLK', title: 'Blocks', property: 'blk', label: 'Blk' },
    { key: '3PM', title: '3 Pointers Made', property: 'tpm', label: '3PM' },
    { key: 'FTM', title: 'Free Throws Made', property: 'ftm', label: 'FTM' },
  ];

  //Generic column labels
  readonly columnLabels = ['Player', 'Team', 'Pos'] as const;

  //Today's date
  readonly #date = new Date();

  //Yesterday's formatted date
  readonly formattedDate = (() => {
    this.#date.setDate(this.#date.getDate() - 1);
    return this.#date.toISOString().slice(0, 10).replace(/-/g, '');
  })();

  //Getting daily lines from API service
  readonly dailyLines = this.#apiUrl.getDailyLines(this.formattedDate);

  //Getting daily leaders from daily lines
  readonly dailyLeaders = this.dailyLines.pipe(
    map(lines => this.#apiUrl.getLeaders(lines)) //transforming Observable<DailyLine[]> into DailyLine[]
  );
}
