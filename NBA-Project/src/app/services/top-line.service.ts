import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs';

export interface TopScorers {
    id: string;
    icon: string;
    name: string;
    team: string;
    ppg: number;
    fgPct: number;
}

export interface TopRebounders {
    id: string;
    icon: string;
    name: string;
    team: string;
    rebounds: number;
}

export interface TopAssists {
    id: string;
    icon: string;
    name: string;
    team: string;
    assists: number;
}


export interface TopSteals {
    id: string;
    icon: string;
    name: string;
    team: string;
    steals: number;
}

export interface TopBlocks {
    id: string;
    icon: string;
    name: string;
    team: string;
    blocks: number;
}

export interface Top3pts {
    id: string;
    icon: string;
    name: string;
    team: string;
    three: number;
    threePct : number;
}

export interface TopTurnovers {
    id: string;
    icon: string;
    name: string;
    team: string;
    to: number;
}


@Injectable({
  providedIn: 'root'
})
export class ApiDataTopLines {
    //API Routes
    readonly #apiUrlByAthlete = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/statistics/byathlete';

    constructor(private http: HttpClient) {}

    //Functions
    decimalRound(n: number): number {
        return Math.round(Number(n) * 10) / 10;
    }

    getStat(response: any, athlete: any, statName: string, catName?: string): number {
        const categories: any[] = response.categories ?? [];
        console.log(categories);
        for (let catIdx = 0; catIdx < categories.length; catIdx++) {
            if (catName && categories[catIdx].name !== catName) continue;

            const statIdx = (categories[catIdx].names ?? []).indexOf(statName);
            if (statIdx !== -1) {
                return Number(athlete.categories[catIdx]?.values[statIdx] ?? 0);
            }
        }
        return 0;
    }

    getAvatar(id: string): string {
        return `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;
    }

    getTeamAvatar(id: string):string {
        return `https://a.espncdn.com/i/teamlogos/nba/500/${id.toLowerCase()}.png`;
    }

    //Top Scorers getter
    getTopScorers(): Observable<TopScorers[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'offensive', sort: 'offensive.avgPoints:desc', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): TopScorers => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    ppg: this.decimalRound(this.getStat(res, a, 'avgPoints', 'offensive')),
                    fgPct: this.decimalRound(this.getStat(res, a, 'fieldGoalPct', 'offensive')),
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
                return res.athletes.map((a: any): TopRebounders => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    rebounds: this.decimalRound(this.getStat(res, a, 'avgRebounds')),
                }));
            })
        );
    }

    //Top Assists getter
    getTopAssists(): Observable<TopAssists[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'offensive.avgAssists:desc', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): TopAssists => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    assists: this.decimalRound(this.getStat(res, a, 'avgAssists')),
                }));
            })
        );
    }

    //Top Steals getter
    getTopSteals(): Observable<TopSteals[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'defensive.avgSteals:desc', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): TopSteals => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    steals: this.decimalRound(this.getStat(res, a, 'avgSteals')),
                }));
            })
        );
    }

    //Top Blocks getter
    getTopBlocks(): Observable<TopBlocks[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'defensive.avgBlocks:desc', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): TopBlocks => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    blocks: this.decimalRound(this.getStat(res, a, 'avgBlocks')),
                }));
            })
        );
    }

    //Top Three getter
    getTopThree(): Observable<Top3pts[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'offensive.threePointFieldGoalsMade:desc', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): Top3pts => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    three: this.decimalRound(this.getStat(res, a, 'threePointFieldGoalsMade')),
                    threePct: this.decimalRound(this.getStat(res, a, 'threePointFieldGoalPct')),
                }));
            })
        );
    }

    //Top Turnovers getter
    getTopTurnovers(): Observable<TopTurnovers[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'offensive.avgTurnovers:desc', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): TopTurnovers => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    to: this.decimalRound(this.getStat(res, a, 'avgTurnovers')),
                }));
            })
        );
    }

    //Top ThreePct getter
    getTopThreePct(): Observable<Top3pts[]> {
        return this.http.get<any>(this.#apiUrlByAthlete, {
            params: { category: 'general', sort: 'offensive.threePointFieldGoalPct', limit: '10' }
        }).pipe(
            map(res => {
                return res.athletes.map((a: any): Top3pts => ({
                    id: a.athlete.id,
                    icon: this.getAvatar(a.athlete.id),
                    name: a.athlete.displayName,
                    team: this.getTeamAvatar(a.athlete.teamShortName),
                    three: this.decimalRound(this.getStat(res, a, 'threePointFieldGoalsMade')),
                    threePct: this.decimalRound(this.getStat(res, a, 'threePointFieldGoalPct')),
                }));
            })
        );
    }
}