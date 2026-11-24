import { Injectable } from '@angular/core';
import { DailyLine, DailyStatProperty } from './daily-lines.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {

    getAvatar(id: string): string {
      return `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`;
    }

    getTeamAvatar(id: string): string {
      return `https://a.espncdn.com/i/teamlogos/nba/500/${id.toLowerCase()}.png`;
    }

    decimalRound(n: number): number {
      return Math.round(Number(n) * 10) / 10;
    }

    getFormattedDateForTitle (date : Date) {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
    }
}
