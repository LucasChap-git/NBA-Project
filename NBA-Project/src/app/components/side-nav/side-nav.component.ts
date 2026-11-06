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
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Projects', icon: 'folder', route: '/projects' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  //Close it or open it
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}