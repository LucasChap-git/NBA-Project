import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-section-title',
  imports: [
    MatIcon,
  ],
  templateUrl: './section-title.html',
  styleUrl: './section-title.scss',
})
export class SectionTitle {
    title = input.required<string>();
    description = input<string>('');

    date = input<string | null>(null);
    context = input<string | null>(null);
    status = input<string | null>(null);

    showDate = input(true);
    showFooter = input(true);
}
