import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GeneralService } from './general.service';

export interface Game {
  id : number
  hostTeam : Team
  guestTeam : Team
}

export interface Team {
  id: number
  team: string
  abbreviation: string
  score: number
}

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  //ESPN API Url
  readonly #apiRecentGames = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

  //General service
  readonly #serviceGeneral = inject(GeneralService);

  constructor(private http: HttpClient){};

  getRecentGames(date: string): Observable<Game[]> {
    return this.http.get<any>(`${this.#apiRecentGames}?dates=${date}`).pipe(
      map((res) => {
        const games: Game[] = [];

        for (const event of res.events) {
          const competitors = event.competitions[0].competitors;
          const home = competitors.find((c: any) => c.homeAway === 'home');
          const away = competitors.find((c: any) => c.homeAway === 'away');

          games.push({
            id: Number(event.id),
            hostTeam: {
              id: Number(home.team.id),
              team: this.#serviceGeneral.getTeamAvatar(home.team.abbreviation),
              abbreviation: home.team.abbreviation,
              score: Number(home.score),
            },
            guestTeam: {
              id: Number(away.team.id),
              team: this.#serviceGeneral.getTeamAvatar(away.team.abbreviation),
              abbreviation: away.team.abbreviation,
              score: Number(away.score),
            },
          });
        }
        return games;
      })
    );
  }
}
