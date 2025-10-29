import { Component, OnInit, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private title: Title,
    private meta: Meta,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    const pageTitle = 'צור קשר | כהן־קזז – משרד עורכי דין';
    const description =
      'צרו קשר עם כהן־קזז – משרד עורכי דין בקריית גת: ייעוץ מקצועי במיוחד בדיני מקרקעין ודיני משפחה. כתובת: רח׳ חשוון 10 (Publico). טלפון: 052-6706744 (חגי), 054-6949137 (עפרה). שעות פעילות: א׳–ה׳ 09:00–18:00.';
    const canonical = 'https://cohenkazaz.law/contact';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'כהן-קזז, משרד עורכי דין' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    this.upsertJsonLd('contact-page', {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'צור קשר – כהן־קזז, משרד עורכי דין',
      'url': canonical,
      'about': ['דיני מקרקעין', 'דיני משפחה', 'ייפוי כוח מתמשך']
    });

    this.upsertJsonLd('legalservice-contact', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז, משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'keywords': ['דיני מקרקעין', 'דיני משפחה', 'עורך דין גירושין', 'משמורת', 'הסכמי ממון'],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'רחוב חשוון 10, קומה ג׳ (Publico)',
        'addressLocality': 'קריית גת',
        'addressRegion': 'מחוז הדרום',
        'addressCountry': 'IL'
      },
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'telephone': '+972-52-6706744',
          'contactType': 'customer service',
          'availableLanguage': ['he']
        },
        {
          '@type': 'ContactPoint',
          'telephone': '+972-54-6949137',
          'contactType': 'customer service',
          'availableLanguage': ['he']
        }
      ],
      'openingHoursSpecification': [{
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
        'opens': '09:00',
        'closes': '18:00'
      }]
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      message: ['', Validators.required]
    });
  }

  sendWhatsApp(phone: string) {
    const text = encodeURIComponent('שלום, אשמח לשוחח בקשר לייעוץ משפטי.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
    }
  }

  private upsertJsonLd(id: string, obj: any) {
    const scriptId = `jsonld-${id}`;
    let el = this.doc.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = this.doc.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      this.doc.head.appendChild(el);
    }
    el.textContent = JSON.stringify(obj);
  }
}
