import { Routes } from '@angular/router';
import { IndexPage } from './components/index';
import { DailyLines } from './components/daily-line/daily-lines';
import { TopLines } from './components/top-lines/top-lines';
import { Dashboard } from './components/dashboard/dashboard';
import { Standings } from './components/standings/standings';

export const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children: [
      { path: '', component: Dashboard },
      {path: 'season-leaders', component: TopLines},
      {path: 'standings', component: Standings},
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];