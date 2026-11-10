import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

export interface DailyLine {
    id: string;
    icon: string;
    name: string;
    team: string;
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    tpm: number;
    position: string;
}

export type DailyLeaderKey = 'PTS' | 'REB' | 'AST' | 'STL' | 'BLK' | '3PM';
export type DailyStatProperty = 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'tpm';
export type DailyLeaders = Record<DailyLeaderKey, DailyLine[]>;

export interface DailyLeaderConfig {
    key: DailyLeaderKey;
    title: string;
    property: DailyStatProperty;
    unit: string;
    iconClass: string;
}

export const DAILY_LEADERS: DailyLeaderConfig[] = [
    { key: 'PTS', title: 'Points Leaders', property: 'pts', unit: 'PTS', iconClass: 'pts' },
    { key: 'REB', title: 'Rebounds Leaders', property: 'reb', unit: 'REB', iconClass: 'reb' },
    { key: 'AST', title: 'Assists Leaders', property: 'ast', unit: 'AST', iconClass: 'ast' },
    { key: 'STL', title: 'Steals Leaders', property: 'stl', unit: 'STL', iconClass: 'stl' },
    { key: 'BLK', title: 'Blocks Leaders', property: 'blk', unit: 'BLK', iconClass: 'blk' },
    { key: '3PM', title: 'Three Pointers Leaders', property: 'tpm', unit: '3PM', iconClass: '3pm' },
];

interface ScoreboardEvent {
    id: string;
}

interface ScoreboardResponse {
    events?: ScoreboardEvent[];
}

interface BoxscoreAthlete {
    athlete: {
        id: string;
        displayName: string;
        position?: {
            abbreviation?: string;
        };
    };
    didNotPlay?: boolean;
    stats?: string[];
}

interface BoxscoreTeam {
    team: {
        abbreviation: string;
    };
    statistics?: Array<{
        labels: string[];
        athletes: BoxscoreAthlete[];
    }>;
}

interface SummaryResponse {
    boxscore?: {
        players?: BoxscoreTeam[];
    };
}

@Injectable({
    providedIn: 'root',
})
export class ApiDataDailyLines {
    readonly #apiUrlDailyLine =
        'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

    constructor(private http: HttpClient) {}

    getDailyLines(date: string): Observable<DailyLine[]> {
        return this.http
            .get<ScoreboardResponse>(`${this.#apiUrlDailyLine}/scoreboard`, {
                params: { dates: date },
            })
            .pipe(
                switchMap((scoreboard) => {
                    const ids = (scoreboard.events ?? []).map((event) => event.id);
                    if (!ids.length) {
                        return of([] as SummaryResponse[]);
                    }
                    return forkJoin(
                        ids.map((id) =>
                            this.http.get<SummaryResponse>(
                                `${this.#apiUrlDailyLine}/summary`,
                                { params: { event: id } },
                            ),
                        ),
                    );
                }),
                map((summaries) => summaries.flatMap((summary) => this.#parseBoxscore(summary))),
                catchError(() => of([])),
            );
    }

    getLeaders(lines: DailyLine[], property: DailyStatProperty): DailyLine[] {
        return [...lines]
            .sort((a, b) => b[property] - a[property])
            .slice(0, 10);
    }

    #parseBoxscore(summary: SummaryResponse): DailyLine[] {
        const made = (value: string | undefined): number =>
            Number(String(value).split('-')[0]) || 0;

        return (summary.boxscore?.players ?? []).flatMap((team) => {
            const block = team.statistics?.[0];
            if (!block) {
                return [];
            }

            const column = (stats: string[], label: string): string | undefined =>
                stats[block.labels.indexOf(label)];

            return block.athletes
                .filter((athlete) => !athlete.didNotPlay && athlete.stats?.length)
                .map(
                    (athlete): DailyLine => ({
                        id: athlete.athlete.id,
                        icon: this.getAvatar(athlete.athlete.id),
                        name: athlete.athlete.displayName,
                        team: this.getTeamAvatar(team.team.abbreviation),
                        position: athlete.athlete.position?.abbreviation ?? '-',
                        pts: Number(column(athlete.stats ?? [], 'PTS')) || 0,
                        reb: Number(column(athlete.stats ?? [], 'REB')) || 0,
                        ast: Number(column(athlete.stats ?? [], 'AST')) || 0,
                        stl: Number(column(athlete.stats ?? [], 'STL')) || 0,
                        blk: Number(column(athlete.stats ?? [], 'BLK')) || 0,
                        tpm: made(column(athlete.stats ?? [], '3PT')),
                    }),
                );
        });
    }

    private getAvatar(id: string): string {
        return `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;
    }

    private getTeamAvatar(abbreviation: string): string {
        return `https://a.espncdn.com/i/teamlogos/nba/500/${abbreviation.toLowerCase()}.png`;
    }
}
