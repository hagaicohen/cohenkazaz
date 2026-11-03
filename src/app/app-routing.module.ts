import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * כתובות לחלקי האתר (קישורי שיתוף בלבד – לא עמודים נפרדים).
 * לנתיבים אין קומפוננטה: הם רק מסנכרנים את כתובת הדפדפן, ו-AppComponent מציג את החלק המתאים
 * בדיוק כמו בלחיצה על התפריט (דסקטופ: החלפת חלק, מובייל: גלילה בעמוד האחד).
 * ה-canonical של כל הכתובות הוא דף הבית (מוגדר ב-index.html), וב-sitemap מופיע רק דף הבית.
 */
export const SECTION_PATHS = ['about', 'services', 'contact'] as const;

export const routes: Routes = [
  { path: '', pathMatch: 'full', children: [] },
  ...SECTION_PATHS.map(path => ({ path, children: [] })),
  { path: '**', redirectTo: '' }
];

@NgModule({
  // onSameUrlNavigation: לחיצה חוזרת על החלק הנוכחי ממשיכה לגלול אליו, כמו היום
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
