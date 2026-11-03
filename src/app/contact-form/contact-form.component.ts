import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

/** מספר הוואטסאפ של המשרד (זהה לקישור הוואטסאפ של חגי בעמוד צור קשר) */
const WHATSAPP_NUMBER = '972526706744';
/** טלפון ישראלי: 0X / 05X או ‎+972, עם או בלי רווחים ומקפים */
const PHONE_PATTERN = /^(?:\+?972[\s-]?|0)(?:\d[\s-]?){7,8}\d$/;
/** Validators.email מקבל גם "a@b" – דורשים גם סיומת דומיין */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** מניעת פתיחת כמה חלונות בלחיצה כפולה */
const REOPEN_GUARD_MS = 1500;

/** דוא״ל אינו חובה, אך אם הוזן – חייב להיות תקין */
function optionalEmail(c: AbstractControl): ValidationErrors | null {
  const v = (c.value || '').trim();
  return !v || EMAIL_PATTERN.test(v) ? null : { email: true };
}

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  @ViewChild('statusBox') statusBox?: ElementRef<HTMLElement>;

  readonly topics = ['מקרקעין ומיסוי מקרקעין', 'דיני משפחה וירושה', 'גישור ויישוב סכסוכים', 'אחר'];
  readonly messageMax = 2000;

  form!: FormGroup;
  submitAttempted = false;
  /** הקישור האחרון שנפתח – מוצג גם כקישור גיבוי אם הדפדפן חסם את החלון */
  whatsappUrl = '';
  private lastOpenedAt = 0;

  constructor(private fb: FormBuilder, private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      email: ['', [optionalEmail, Validators.maxLength(150)]],
      topic: [''],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.messageMax)]]
    });
  }

  showError(name: string): boolean {
    const c = this.form.get(name)!;
    return c.invalid && (c.touched || this.submitAttempted);
  }

  errorText(name: string): string {
    const c: AbstractControl = this.form.get(name)!;
    if (c.hasError('required')) return 'שדה חובה';
    switch (name) {
      case 'name': return 'נא להזין שם מלא';
      case 'phone': return 'נא להזין מספר טלפון תקין, לדוגמה 052-1234567';
      case 'email': return 'נא להזין כתובת דוא״ל תקינה או להשאיר את השדה ריק';
      case 'message': return c.hasError('maxlength')
        ? `ההודעה ארוכה מדי (עד ${this.messageMax} תווים)`
        : 'נא לפרט מעט יותר (לפחות 10 תווים)';
    }
    return '';
  }

  /** ההודעה המוכנה לוואטסאפ – כוללת רק שדות שמולאו */
  buildMessage(): string {
    const v = this.form.getRawValue();
    const lines = [
      'שלום, אני פונה דרך אתר כהן־קזז.',
      '',
      `שם מלא: ${v.name.trim()}`,
      `טלפון: ${v.phone.trim()}`
    ];
    if (v.email.trim()) lines.push(`דוא״ל: ${v.email.trim()}`);
    if (v.topic) lines.push(`נושא הפנייה: ${v.topic}`);
    lines.push('', 'הודעה:', v.message.trim());
    return lines.join('\n');
  }

  onSubmit(): void {
    this.submitAttempted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    // לחיצה כפולה – לא פותחים חלון נוסף
    if (Date.now() - this.lastOpenedAt < REOPEN_GUARD_MS) return;
    this.lastOpenedAt = Date.now();

    this.whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(this.buildMessage())}`;

    // נפתח בתוך אירוע הלחיצה, ולכן חוסמי חלונות קופצים מאפשרים זאת.
    // במחשב נפתחת לשונית חדשה (WhatsApp Web / אפליקציה), בנייד – אפליקציית וואטסאפ.
    const win = window.open(this.whatsappUrl, '_blank');
    if (win) {
      win.opener = null;
    } else {
      // החלון נחסם – מעבר באותה לשונית
      window.location.href = this.whatsappUrl;
    }

    // הטופס אינו מתאפס, ואין הודעת "נשלח" – השליחה עצמה נעשית ע״י המשתמש בוואטסאפ
    setTimeout(() => this.statusBox?.nativeElement.focus());
  }

  private focusFirstInvalid(): void {
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('.ng-invalid[formControlName]')?.focus());
  }
}
