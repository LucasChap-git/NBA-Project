import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import {
    ApiDataDailyLines,
    DAILY_LEADERS,
    DailyLeaderConfig,
} from '../../services/daily-lines.service';
import { SectionTitle } from '../section-title/section-title';

@Component({
    selector: 'app-daily-lines',
    imports: [AsyncPipe, RouterLink, MatIcon, SectionTitle],
    templateUrl: './daily-lines.html',
    styleUrl: './daily-lines.scss',
})
export class DailyLines {
    readonly #apiService = inject(ApiDataDailyLines);

    readonly #date = new Date();

    //For section title
    readonly formattedDateForTitle = this.#date
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        .toUpperCase();

    readonly #formattedDate = (() => {
        this.#date.setDate(this.#date.getDate() - 1);
        return this.#date.toISOString().slice(0, 10).replace(/-/g, '');
    })();

    readonly #dailyLines = this.#apiService
        .getDailyLines(this.#formattedDate)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));

    readonly leaders = DAILY_LEADERS.map((config: DailyLeaderConfig) => ({
        config,
        players$: this.#dailyLines.pipe(
            map((lines) => this.#apiService.getLeaders(lines, config.property)),
        ),
    }));
}
