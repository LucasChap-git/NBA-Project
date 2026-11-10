import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs';

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
export class ApiDataDailyLines {
    //API Routes
    readonly #apiUrlDailyLine = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

    constructor(private http: HttpClient) {}

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