import { inject, Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Team {
  id : number
  conference: string
  logo : string
  teamName : string
  win : number
  loss : number
  pct : number
  gamesBack : number
  homeScore : string
  awayScore : string
  ppg : number
  oppPpg : number
  diff : number
  streak : number
  last10 : string
}

@Injectable({
  providedIn: 'root',
})
export class StandingsService {
  //ESPN API Url
  #apiUrl = "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings";

  //General service
  #generalService = inject(GeneralService);

  constructor (private http : HttpClient){}

  //Standings getter for teams
  getStandingsTeams () : Observable<Team[]> {

      const getStat = (entry: any, key: string, field: 'displayValue' | 'value' = 'displayValue') =>
        entry.stats.find((s: any) => s.name === key || s.type === key)?.[field];

    return this.http.get<any>(`${this.#apiUrl}`).pipe (
      map((res) => {
        const standings: Team[] = [];

        for (const conference of res.children) {
          for (const entry of conference.standings.entries) {
            const team = entry.team;

            standings.push({
              id : team.id,
              conference: conference.abbreviation,
              logo: this.#generalService.getTeamAvatar(team.abbreviation),
              teamName: team.displayName,
              win: getStat(entry, 'wins'),                  // "10"
              loss: getStat(entry, 'losses'),               // "6"
              pct: getStat(entry, 'winPercent'),            // ".625"
              gamesBack: getStat(entry, 'gamesBehind'),     // "3.5" ou "-" pour le leader
              homeScore: getStat(entry, 'home'),            // "7-2" (bilan à domicile)
              awayScore: getStat(entry, 'road'),            // "7-1" (bilan à l'extérieur)
              ppg: getStat(entry, 'avgPointsFor'),          // "111.2"
              oppPpg: getStat(entry, 'avgPointsAgainst'),   // "102.1"
              diff: getStat(entry, 'differential'),         // "+9.1"
              streak: getStat(entry, 'streak'),             // "W5" / "L4"
              last10: getStat(entry, 'lasttengames'),       // "8-2"
            });
          }
        }
        standings.sort((a, b) => Number(b.pct) - Number(a.pct)); //Sort by win pct       

        return standings;
      }

      )
    )
  }
}
