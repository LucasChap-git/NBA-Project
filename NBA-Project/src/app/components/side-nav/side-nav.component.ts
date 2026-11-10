import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Title } from '../title/title.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    Title
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  isCollapsed = false;

  //Side nav titles
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '' },
    { label: 'Results', icon: 'calendar_month', route: '/results' },
    { label: 'Standings', icon: 'leaderboard', route: '/standings' },
    { label: 'Season leaders', icon: 'query_stats', route: '/season-leaders' },
    { label: 'Ladders', icon: 'military_tech', route: '/ladders' },
    { label: 'Players', icon: 'person', route: '/players' },
    { label: 'Teams', icon: 'groups', route: '/teams' }
  ];

  //Close it or open it
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}