import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss']
})
export class FollowBtnComponent {
  @Input() label = 'Button';
}
