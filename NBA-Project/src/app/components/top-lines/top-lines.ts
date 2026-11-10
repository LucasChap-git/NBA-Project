import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ApiDataTopLines, LEADERS } from '../../services/top-line.service';

@Component({
    selector: 'app-top-lines',
    imports: [
      AsyncPipe, 
      RouterLink, 
      MatIcon
    ],
    templateUrl: './top-lines.html',
    styleUrl: './top-lines.scss',
})
export class TopLines {
    readonly #apiService = inject(ApiDataTopLines);

    readonly leaders = LEADERS.map((config) => ({
        config,
        players$: this.#apiService.getLeaders(config),
    }));
}
