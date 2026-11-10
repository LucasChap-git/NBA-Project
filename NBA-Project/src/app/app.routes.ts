import { Routes } from '@angular/router';
import { IndexPage } from './components/index';
import { DailyLines } from './components/daily-line/daily-lines';
import { TopLines } from './components/top-lines/top-lines';

export const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children: [
      { path: '', component: DailyLines },
      {path: 'season-leaders', component: TopLines},
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];