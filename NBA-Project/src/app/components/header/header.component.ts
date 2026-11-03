import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '../title/title.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    MatIconModule,
    Title,
  ],
})
export class Header {

}