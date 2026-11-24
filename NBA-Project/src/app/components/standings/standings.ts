import { Component, inject } from '@angular/core';
import { StandingsService } from '../../services/standings.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SectionTitle } from '../section-title/section-title';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-standings',
  imports: [
    SectionTitle,
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
  readonly standings = toSignal(this.#apiService.getStandingsTeams());
}
