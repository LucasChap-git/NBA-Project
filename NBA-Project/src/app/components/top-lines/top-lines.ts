import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ApiDataTopLines, LEADERS } from '../../services/top-line.service';
import { SectionTitle } from '../section-title/section-title';

@Component({
    selector: 'app-top-lines',
    imports: [
    AsyncPipe,
    RouterLink,
    MatIcon,
    SectionTitle,
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

    readonly #date = new Date();

    //For section title
    readonly formattedDateForTitle = this.#date
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        .toUpperCase();
}
