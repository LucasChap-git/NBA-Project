import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ApiDataTopLines, TopScorers } from '../../services/top-line.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-top-lines',
  imports: [
    RouterModule,
    AsyncPipe,
    MatIcon,
],
  templateUrl: './top-lines.html',
  styleUrl: './top-lines.scss',
})
export class TopLines {
    //Inject
    readonly #apiService = inject(ApiDataTopLines);
  
    //Datas
    readonly topScorers = this.#apiService.getTopScorers();
    readonly topRebounders = this.#apiService.getTopRebounders();
    readonly topAssists = this.#apiService.getTopAssists();
    readonly topSteals = this.#apiService.getTopSteals();
    readonly topBlocks = this.#apiService.getTopBlocks();
    readonly topThreePointers = this.#apiService.getTopThree();
    readonly TopThreePct = this.#apiService.getTopThreePct();
    readonly topTurnovers = this.#apiService.getTopTurnovers();
}
