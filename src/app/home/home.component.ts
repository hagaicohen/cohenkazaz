import { Component, EventEmitter, Output } from '@angular/core';
import { isPlainLeftClick } from '../shared/link-click';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /** בקשת מעבר לחלק אחר באתר (למשל 'contact' או 'services#family-law') */
  @Output() navigate = new EventEmitter<string>();

  /**
   * עיצוב ה-Hero בדף הבית:
   *  'team'   – תמונת הצוות (hero-team-desktop / hero-team-mobile)
   *  'office' – העיצוב הקודם עם תמונת המשרד (office3.jpg)
   * למעבר בין העיצובים: לשנות את הערך (ולעדכן את ה-preload ב-index.html).
   */
  readonly heroVariant: 'team' | 'office' = 'office';

  readonly practiceAreas = [
    {
      title: 'מקרקעין ומיסוי מקרקעין',
      text: 'ליווי בעסקאות מכר ורכישה, ייצוג קבלנים ויזמים והתחדשות עירונית, לצד ייעוץ במס שבח ומס רכישה, השגות על שומות ותכנון מס.',
      anchor: 'real-estate',
      icon: ['M3 21h18', 'M5 21V8l7-5 7 5v13', 'M10 21v-5h4v5', 'M9 11h6']
    },
    {
      title: 'דיני משפחה וירושה',
      text: 'גירושין וחלוקת רכוש, משמורת וזמני שהות, מזונות והסכמי ממון, לצד עריכת צוואות, צווי ירושה וייפוי כוח מתמשך.',
      anchor: 'family-law',
      icon: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6', 'M16 11a2.5 2.5 0 1 0 0-5', 'M17 14c2.4.4 4 2.6 4 5']
    },
    {
      title: 'גישור ויישוב סכסוכים',
      text: 'הליכי גישור משפחתיים ואזרחיים, המתמקדים בשיח מכבד ובהגעה להסכמות שניתן לעגן בהסכם משפטי ברור ואכיף.',
      anchor: 'mediation',
      icon: ['M12 3v18', 'M7 21h10', 'M4 7h16', 'M4 7l-3 6a3 3 0 0 0 6 0z', 'M20 7l-3 6a3 3 0 0 0 6 0z']
    }
  ];

  go(target: string, event?: Event): void {
    if (!isPlainLeftClick(event)) return;
    event?.preventDefault();
    this.navigate.emit(target);
  }
}
