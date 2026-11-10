import { Component } from '@angular/core';
import { TopLines } from '../top-lines/top-lines';

@Component({
  selector: 'app-season-top-stats',
  imports: [
    TopLines,
  ],
  templateUrl: './season-top-stats.html',
  styleUrl: './season-top-stats.scss',
})
export class SeasonTopStats {}
