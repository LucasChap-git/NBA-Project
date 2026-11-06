import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';


export interface TopScorer {
    id: string;
    name: string;
    team: string;
    ppg: number;
    games: number;
    minutes: number;
    fgPct: number;
    threePct: number;
    ftPct: number;
    position: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiData {
    //API Routes
    readonly #apiUrlByAthlete = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/statistics/byathlete';

    constructor(private http: HttpClient) {}

    //Top Scorers
    getTopScorers(): Observable<TopScorer[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'offensive', sort: 'offensive.avgPoints:desc', limit: '10' }
        }).pipe(
            map(res => {
                const round1 = (n: number) => Math.round(Number(n) * 10) / 10;

                const getStat = (athlete: any, catName: string, statName: string): number => {
                    const catIdx = res.categories.findIndex((c: any) => c.name === catName);
                    if (catIdx === -1) return 0;

                    const statIdx = res.categories[catIdx].names.indexOf(statName);
                    if (statIdx === -1) return 0;

                    return athlete.categories[catIdx].values[statIdx];
                };

                return res.athletes.map((a: any): TopScorer => ({
                    id: a.athlete.id,
                    name: a.athlete.displayName,
                    team: a.athlete.teamShortName,
                    position: a.athlete.position?.abbreviation ?? '-',
                    ppg: round1(getStat(a, 'offensive', 'avgPoints')),
                    games: getStat(a, 'general', 'gamesPlayed'),
                    minutes: round1(getStat(a, 'general', 'avgMinutes')),
                    fgPct: round1(getStat(a, 'offensive', 'fieldGoalPct')),
                    threePct: round1(getStat(a, 'offensive', 'threePointFieldGoalPct')),
                    ftPct: round1(getStat(a, 'offensive', 'freeThrowPct'))
                }));
            })
        );
    }
}