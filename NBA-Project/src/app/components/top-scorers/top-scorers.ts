import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ApiData, TopScorer } from '../../services/api.service';

@Component({
  selector: 'app-top-scorers',
  imports: [
    RouterModule,
    AsyncPipe,
    JsonPipe
],
  templateUrl: './top-scorers.html',
  styleUrl: './top-scorers.scss',
})
export class TopScorers {
    //Services
    readonly #apiService = inject(ApiData);
  
    //Tableau
    readonly topScorersTab: { key: keyof TopScorer; label: string }[] = [
      { key: 'name',      label: 'Player' },
      { key: 'team',      label: 'Team' },
      { key: 'position',  label: 'Pos' },
      { key: 'ppg',       label: 'PTS' },
      { key: 'games',     label: 'GP' },
      { key: 'minutes',   label: 'MIN' },
      { key: 'fgPct',     label: 'FG%' },
      { key: 'threePct',  label: '3P%' },
      { key: 'ftPct',     label: 'FT%' },
    ];
  
    //Données
    readonly topScorers = this.#apiService.getTopScorers();
}
