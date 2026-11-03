import { Component, EventEmitter, Output } from '@angular/core';
import { isPlainLeftClick } from '../shared/link-click';

/** Hero עם תמונת הצוות (גרסת דסקטופ ומובייל), טקסט HTML אמיתי מעל התמונה */
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  @Output() navigate = new EventEmitter<string>();

  go(target: string, event?: Event): void {
    if (!isPlainLeftClick(event)) return;
    event?.preventDefault();
    this.navigate.emit(target);
  }
}
