import { Component, inject } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-match-aside',
  imports: [],
  templateUrl: './match-aside.html',
  styleUrl: './match-aside.scss',
})
export class MatchAside {
  //Service
  readonly #apiService = inject(MatchService);

  //Date
  readonly #date = new Date ();

  readonly #formattedDate = (() => {
        this.#date.setDate(this.#date.getDate() - 1);
        return this.#date.toISOString().slice(0, 10).replace(/-/g, '');
  })();

  readonly games = toSignal(this.#apiService.getRecentGames(this.#formattedDate), { initialValue: [] });
}