import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let openSpy: jasmine.Spy;

  const valid = {
    name: 'ישראל ישראלי',
    phone: '052-670-6744',
    email: 'test@example.com',
    topic: 'דיני משפחה וירושה',
    message: 'שאלה לגבי הסכם מכר & דירה?'
  };

  /** מחלץ את ההודעה מתוך הקישור שנפתח */
  const openedText = () => {
    const url = new URL(openSpy.calls.mostRecent().args[0]);
    return url.searchParams.get('text')!;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ContactFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    openSpy = spyOn(window, 'open').and.returnValue({ opener: {} } as Window);
  });

  it('requires name, phone and message; email and topic are optional', () => {
    const f = component.form;
    expect(f.valid).toBeFalse();
    f.setValue({ ...valid, email: '', topic: '' });
    expect(f.valid).toBeTrue();
  });

  it('validates Israeli phone numbers, and email only when provided', () => {
    const phone = component.form.get('phone')!;
    ['052-670-6744', '0526706744', '+972 52 670 6744', '08-6123456'].forEach(p => {
      phone.setValue(p);
      expect(phone.valid).withContext(p).toBeTrue();
    });
    ['12345', 'abc', '052-670'].forEach(p => {
      phone.setValue(p);
      expect(phone.valid).withContext(p).toBeFalse();
    });
    const email = component.form.get('email')!;
    email.setValue('');
    expect(email.valid).toBeTrue();
    email.setValue('a@b');
    expect(email.valid).toBeFalse();
  });

  it('does not open WhatsApp when the form is invalid', () => {
    component.onSubmit();
    expect(openSpy).not.toHaveBeenCalled();
    expect(component.submitAttempted).toBeTrue();
  });

  it('opens wa.me for the office number with an encoded message of all fields', () => {
    component.form.setValue(valid);
    component.onSubmit();

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url, target] = openSpy.calls.mostRecent().args;
    expect(url).toMatch(/^https:\/\/wa\.me\/972526706744\?text=/);
    expect(target).toBe('_blank');
    // encodeURIComponent: אין תווים לא מקודדים (רווחים, &, ?, שורות חדשות) בפרמטר
    expect(url.split('?text=')[1]).toBe(encodeURIComponent(component.buildMessage()));

    const text = openedText();
    [valid.name, valid.phone, valid.email, valid.topic, valid.message].forEach(v =>
      expect(text).withContext(v).toContain(v));
  });

  it('omits empty optional fields from the message', () => {
    component.form.setValue({ ...valid, email: '', topic: '' });
    component.onSubmit();
    const text = openedText();
    expect(text).not.toContain('דוא״ל:');
    expect(text).not.toContain('נושא הפנייה:');
  });

  it('keeps the form filled and does not claim the message was sent', () => {
    component.form.setValue(valid);
    component.onSubmit();
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual(valid);
    const status = fixture.nativeElement.querySelector('.cf-status') as HTMLElement;
    expect(status.textContent).toContain('שליחה');
    expect(status.textContent).not.toContain('נשלח ');
    expect(status.textContent).not.toContain('התקבלה');
  });

  it('ignores a rapid second click', () => {
    component.form.setValue(valid);
    component.onSubmit();
    component.onSubmit();
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it('makes no network request', () => {
    const fetchSpy = spyOn(window, 'fetch');
    component.form.setValue(valid);
    component.onSubmit();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('exposes a fallback link to the same URL', () => {
    component.form.setValue(valid);
    component.onSubmit();
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('.cf-status a') as HTMLAnchorElement;
    expect(link.href).toBe(openSpy.calls.mostRecent().args[0]);
  });
});
