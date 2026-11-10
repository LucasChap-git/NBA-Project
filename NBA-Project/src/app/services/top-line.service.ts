import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

export interface LeaderPlayer {
    id: string;
    icon: string;
    name: string;
    team: string;
    value: number;
    secondary?: {
        label: string;
        value: number;
    };
}

export interface LeaderConfig {
    key: string;
    title: string;
    unit: string;
    iconClass: string;
    category: string;
    sort: string;
    stat: string;
    secondary?: {
        stat: string;
        label: string;
    };
    suffix?: string;
}

export const LEADERS: LeaderConfig[] = [
    {
        key: 'pts',
        title: 'Scoring Leaders',
        unit: 'PPG',
        iconClass: 'pts',
        category: 'offensive',
        sort: 'offensive.avgPoints:desc',
        stat: 'avgPoints',
        secondary: { stat: 'fieldGoalPct', label: 'FG%' },
    },
    {
        key: 'reb',
        title: 'Rebounds Leaders',
        unit: 'REB',
        iconClass: 'reb',
        category: 'general',
        sort: 'general.avgRebounds:desc',
        stat: 'avgRebounds',
    },
    {
        key: 'ast',
        title: 'Assists Leaders',
        unit: 'AST',
        iconClass: 'ast',
        category: 'general',
        sort: 'offensive.avgAssists:desc',
        stat: 'avgAssists',
    },
    {
        key: 'stl',
        title: 'Steal Leaders',
        unit: 'STL',
        iconClass: 'stl',
        category: 'general',
        sort: 'defensive.avgSteals:desc',
        stat: 'avgSteals',
    },
    {
        key: 'blk',
        title: 'Block Leaders',
        unit: 'BLK',
        iconClass: 'blk',
        category: 'general',
        sort: 'defensive.avgBlocks:desc',
        stat: 'avgBlocks',
    },
    {
        key: 'to',
        title: 'Turnover Leaders',
        unit: 'TO',
        iconClass: 'to',
        category: 'general',
        sort: 'offensive.avgTurnovers:desc',
        stat: 'avgTurnovers',
    },
    {
        key: '3pm',
        title: 'Three Pointer Leaders',
        unit: 'THREES',
        iconClass: '3pm',
        category: 'general',
        sort: 'offensive.threePointFieldGoalsMade:desc',
        stat: 'threePointFieldGoalsMade',
    },
    {
        key: '3pmPct',
        title: 'Three Pointer Percentage Leaders',
        unit: '',
        iconClass: '3pmPct',
        category: 'general',
        sort: 'offensive.threePointFieldGoalPct:desc',
        stat: 'threePointFieldGoalPct',
        suffix: '%',
    },
];

interface EspnCategory {
    name: string;
    names: string[];
}

interface EspnAthlete {
    athlete: {
        id: string;
        displayName: string;
        teamShortName: string;
    };
    categories: Array<{
        values: number[];
    }>;
}

interface EspnResponse {
    categories?: EspnCategory[];
    athletes?: EspnAthlete[];
}

@Injectable({
    providedIn: 'root',
})
export class ApiDataTopLines {
    readonly #apiUrlByAthlete ='https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/statistics/byathlete';

    constructor(private http: HttpClient) {}

    decimalRound(n: number): number {
        return Math.round(Number(n) * 10) / 10;
    }

    getStat(response: EspnResponse, athlete: EspnAthlete, statName: string, catName?: string, categoryIndexes = this.getCategoryIndexes(response),): number {
        const categoryIndexesForStat = catName
            ? [categoryIndexes.get(catName)].filter((index): index is number => index !== undefined)
            : [...categoryIndexes.values()];

        for (const categoryIndex of categoryIndexesForStat) {
            const statIndex = response.categories?.[categoryIndex]?.names.indexOf(statName) ?? -1;
            if (statIndex !== -1) {
                return Number(athlete.categories[categoryIndex]?.values[statIndex] ?? 0);
            }
        }
        return 0;
    }

    getAvatar(id: string): string {
        return `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;
    }

    getTeamAvatar(id: string): string {
        return `https://a.espncdn.com/i/teamlogos/nba/500/${id.toLowerCase()}.png`;
    }

    getLeaders(config: LeaderConfig): Observable<LeaderPlayer[]> {
        return this.http
            .get<EspnResponse>(this.#apiUrlByAthlete, {
                params: {
                    category: config.category,
                    sort: config.sort,
                    limit: '10',
                },
            })
            .pipe(
                map((response) => {
                    const categoryIndexes = this.getCategoryIndexes(response);
                    return (response.athletes ?? []).map((athlete): LeaderPlayer => {
                        const value = this.decimalRound(
                            this.getStat(response, athlete, config.stat, undefined, categoryIndexes),
                        );
                        const secondary = config.secondary
                            ? {
                                  label: config.secondary.label,
                                  value: this.decimalRound(
                                      this.getStat(
                                          response,
                                          athlete,
                                          config.secondary.stat,
                                          undefined,
                                          categoryIndexes,
                                      ),
                                  ),
                              }
                            : undefined;

                        return {
                            id: athlete.athlete.id,
                            icon: this.getAvatar(athlete.athlete.id),
                            name: athlete.athlete.displayName,
                            team: this.getTeamAvatar(athlete.athlete.teamShortName),
                            value,
                            ...(secondary ? { secondary } : {}),
                        };
                    });
                }),
                catchError(() => of([])),
            );
    }

    private getCategoryIndexes(response: EspnResponse): Map<string, number> {
        return new Map(
            (response.categories ?? []).map((category, index) => [category.name, index]),
        );
    }
}
