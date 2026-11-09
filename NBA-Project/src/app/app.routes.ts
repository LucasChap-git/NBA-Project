import { Routes } from '@angular/router';
import { IndexPage } from './components/index';

export const routes: Routes = [
  {
    path: '',
    component: IndexPage,
  },
  // {
  //   path: 'standings',
  //   component: StandingsPage,
  // },
  // {
  //   path: 'season/statistics',
  //   component: SeasonStatisticsPage,
  // },
  // {
  //   path: 'ladders',
  //   component: LaddersPage,
  // },
  // {
  //   path: 'players',
  //   component: PlayersPage,
  // },
  // {
  //   path: 'teams',
  //   component: TeamsPage,
  // },
  {
    path: '**',
    redirectTo: '',
  },
];