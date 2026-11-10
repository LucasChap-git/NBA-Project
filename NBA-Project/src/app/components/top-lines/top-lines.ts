import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ApiDataTopLines, TopScorer } from '../../services/top-line.service';
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
}
