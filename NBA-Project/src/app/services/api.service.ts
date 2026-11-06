import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
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

export interface DailyLine {
  name: string; 
  team: string;
  pts: number; 
  reb: number; 
  ast: number; 
  stl: number; 
  blk: number;
  tpm: number; 
  ftm: number;
  position: string;
}

export type DailyLeaderKey = 'PTS' | 'REB' | 'AST' | 'STL' | 'BLK' | '3PM' | 'FTM';
export type DailyStatProperty = 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'tpm' | 'ftm';
export type DailyLeaders = Record<DailyLeaderKey, DailyLine[]>;

@Injectable({
  providedIn: 'root'
})
export class ApiData {
    //API Routes
    readonly #apiUrlByAthlete = 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/statistics/byathlete';
    readonly #apiUrlDailyLine = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

    constructor(private http: HttpClient) {}

    //Top Scorers getter
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

    //Daily Lines getter
    getDailyLines(date: string): Observable<DailyLine[]> {
        return this.http.get<any>(`${this.#apiUrlDailyLine}/scoreboard`, { params: { dates: date } }).pipe(
            switchMap(sb => {
            const ids: string[] = sb.events.map((e: any) => e.id);
            if (!ids.length) return of([]);
            return forkJoin(ids.map(id =>
                this.http.get<any>(`${this.#apiUrlDailyLine}/summary`, { params: { event: id } })
            ));
            }),
            map((summaries: any[]) => summaries.flatMap(s => this.#parseBoxscore(s)))
        );
        }

        #parseBoxscore(summary: any): DailyLine[] {
        const made = (v: string) => Number(String(v).split('-')[0]) || 0;

        return (summary.boxscore?.players ?? []).flatMap((team: any) => {
            const block = team.statistics?.[0];
            if (!block) return [];
            const L: string[] = block.labels;
            const col = (stats: string[], label: string) => stats[L.indexOf(label)];

        return block.athletes
            .filter((a: any) => !a.didNotPlay && a.stats?.length) //Excluding DNPs
            .map((a: any): DailyLine => ({
                name: a.athlete.displayName,
                team: team.team.abbreviation,
                position: a.athlete.position?.abbreviation ?? '-',
                pts: Number(col(a.stats, 'PTS')),
                reb: Number(col(a.stats, 'REB')),
                ast: Number(col(a.stats, 'AST')),
                stl: Number(col(a.stats, 'STL')),
                blk: Number(col(a.stats, 'BLK')),
                tpm: made(col(a.stats, '3PT')),
                ftm: made(col(a.stats, 'FT')),
            }));
        });
    }

    //Daily line leaders getter
    getLeaders(lines: DailyLine[]): DailyLeaders {
        //Getting the top 10 of each stats
        const top10 = (key: keyof DailyLine) =>
            [...lines]
            .sort((a, b) => Number(b[key]) - Number(a[key]))
            .slice(0, 10);

        return {
            PTS: top10('pts'),
            REB: top10('reb'),
            AST: top10('ast'),
            STL: top10('stl'),
            BLK: top10('blk'),
            '3PM': top10('tpm'),
            FTM: top10('ftm'),
        };
    }

}