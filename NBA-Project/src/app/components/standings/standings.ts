import { Component, computed, inject, signal } from '@angular/core';
import { StandingsService, Team } from '../../services/standings.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SectionTitle } from '../section-title/section-title';
import { GeneralService } from '../../services/general.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

export interface Column {
  key: string;
  label: string;
  value: (team: Team) => string | number;
}

@Component({
  selector: 'app-standings',
  imports: [
    SectionTitle,
    MatIconModule,
  ],
  templateUrl: './standings.html',
  styleUrl: './standings.scss',
})
export class Standings {
  //API Service
  readonly #apiService = inject(StandingsService);
  //General Service
  readonly #generalService = inject(GeneralService);
  //Today's date
  readonly #date = new Date();
  readonly formattedDate = this.#generalService.getFormattedDateForTitle(this.#date);

  //Boolean to sort by conference
  readonly byConference = signal(true);

  //Full league by win pourcentage
  readonly #standings = toSignal(this.#apiService.getStandingsTeams());
  //Eastern conference by win pourcentage
  readonly #east = computed (() => this.#standings()?.filter(t=> t.conference === "East"));
  //Western conference by win pourcentage
  readonly #west = computed (() => this.#standings()?.filter(t => t.conference === "West"));

  //Main tab content
  readonly tabContent: Column[] = [
    { key: 'team', label: 'Team', value: t => t.teamName },
    { key: 'win', label: 'W', value: t => t.win },
    { key: 'loss', label: 'L', value: t => t.loss },
    { key: 'pct', label: 'PCT', value: t => t.pct },
    { key: 'gamesBack', label: 'GB', value: t => t.gamesBack },
    { key: 'homeScore', label: 'Home', value: t => t.homeScore },
    { key: 'awayScore', label: 'Away', value: t => t.awayScore },
    { key: 'ppg', label: 'PPG', value: t => t.ppg },
    { key: 'oppPpg', label: 'OPP PPG', value: t => t.oppPpg },
    { key: 'diff', label: 'DIFF', value: t => t.diff },
    { key: 'streak', label: 'STREAK', value: t => t.streak },
    { key: 'last10', label: 'L10', value: t => t.last10 },
  ];

  //Groups for different tabs + data for east and west
  readonly groups = computed(() =>
    this.byConference()
      ? [
          { label: 'Eastern Conference', data: this.#east() },
          { label: 'Western Conference', data: this.#west() },
        ]
      : [{ label: 'League Rankings', data: this.#standings() }]
  );

  //Switch the tab view
  switchTabView (): void {
    this.byConference.set(!this.byConference());
  }

  //To assign colors in the tab
  getTeamQualification(team: Team): 'playoffs' | 'playin' | null {
    const eastRank = this.#east()?.findIndex(t => t.id === team.id) ?? -1;
    const westRank = this.#west()?.findIndex(t => t.id === team.id) ?? -1;

    const rank = Math.max(eastRank, westRank);

    if (rank === -1) return null;
    if (rank < 6) return 'playoffs';
    if (rank < 10) return 'playin';

    return null;
  }
}
