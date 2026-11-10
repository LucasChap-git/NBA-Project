import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs';


export interface TopScorer {
    id: string;
    icon: string;
    name: string;
    team: string;
    ppg: number;
    // games: number;
    // minutes: number;
    fgPct: number;
    // threePct: number;
    // ftPct: number;
    // position: string;
}

export interface TopRebounders {
    id: string;
    icon: string;
    name: string;
    team: string;
    rebounds: number;
}


@Injectable({
  providedIn: 'root'
})
export class ApiDataTopLines {
    //API Routes
    readonly #apiUrlByAthlete = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/statistics/byathlete';

    constructor(private http: HttpClient) {}

    //Top Scorers getter
    getTopScorers(): Observable<TopScorer[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'offensive', sort: 'offensive.avgPoints:desc', limit: '10' }
        }).pipe(
            map(res => {
                const decimalRound = (n: number) => Math.round(Number(n) * 10) / 10;

                const getStat = (athlete: any, catName: string, statName: string): number => {
                    const catIdx = res.categories.findIndex((c: any) => c.name === catName);
                    if (catIdx === -1) return 0;

                    const statIdx = res.categories[catIdx].names.indexOf(statName);
                    if (statIdx === -1) return 0;

                    return athlete.categories[catIdx].values[statIdx];
                };

                const getAvatar = (id : string): string => {
                    return `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`
                }

                return res.athletes.map((a: any): TopScorer => ({
                    id: a.athlete.id,
                    icon: getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: a.athlete.teamShortName,
                    ppg: decimalRound(getStat(a, 'offensive', 'avgPoints')),
                    fgPct: decimalRound(getStat(a, 'offensive', 'fieldGoalPct')),
                }));
            })
        );
    }

    //Top Rebounders getter
    getTopRebounders(): Observable<TopRebounders[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'general.avgRebounds:desc', limit: '10' }
        }).pipe(
            map(res => {
                const decimalRound = (n: number) => Math.round(Number(n) * 10) / 10;

                // Cherche la stat dans une catégorie précise, ou dans toutes si catName est omis
                const getStat = (athlete: any, statName: string, catName?: string): number => {
                    const categories: any[] = res.categories ?? [];
                    console.log(res.categories.map((c: any) => ({ name: c.name, names: c.names })));
                    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
                        if (catName && categories[catIdx].name !== catName) continue;

                        const statIdx = categories[catIdx].names.indexOf(statName);
                        if (statIdx !== -1) {
                            return Number(athlete.categories[catIdx]?.values[statIdx] ?? 0);
                        }
                    }
                    return 0;
                };

                const getAvatar = (id: string): string =>
                    `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;

                return res.athletes.map((a: any): TopRebounders => ({
                    id: a.athlete.id,
                    icon: getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: a.athlete.teamShortName,
                    rebounds: decimalRound(getStat(a, 'avgRebounds')),
                }));
            })
        );
    }
}