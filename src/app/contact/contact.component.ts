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
    // טייטל/דסקריפשן עם כל הווריאציות – ללא שינוי נראות
    const pageTitle = 'צור קשר | כהן־קזז – עורך דין משפחה, גירושין, נדל״ן (נדלן) וגישור בקריית/קרית גת';
    const description = 'צרו קשר עם כהן־קזז – משרד עורכי דין בקריית/קרית גת: עורך דין משפחה וגירושין, נדל״ן (נדלן), גישור ומיסוי מקרקעין. כתובת: חשוון 10 (Publico). טלפון: 052-6706744 (חגי), 054-6949137 (עפרה).';

    const canonical = 'https://cohenkazaz.law/contact';
    const ogImage = 'https://cohenkazaz.law/assets/og-default.jpg';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'כהן-קזז, משרד עורכי דין' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: ogImage });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    let linkEl = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = 'canonical';
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    // ===== ContactPage (שקט, ללא UI) =====
    this.upsertJsonLd('contact-page', {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'צור קשר – כהן־קזז, משרד עורכי דין',
      'url': canonical,
      'about': [
        'דיני משפחה','גירושין','משמורת','מזונות','הסכמי ממון','צווי הגנה',
        'נדל״ן','נדלן','מיסוי מקרקעין','גישור','מגשר','מגשרים'
      ],
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'צור קשר', 'item': canonical }
        ]
      }
    });

    // ===== LegalService (מחוזק בווריאציות, ללא שינוי עיצוב) =====
    this.upsertJsonLd('legalservice-contact', {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'כהן־קזז – משרד עורכי דין',
      'url': 'https://cohenkazaz.law/',
      'image': ogImage,
      'serviceType': ['דיני משפחה','גירושין','נדל״ן','נדלן','מיסוי מקרקעין','גישור','מגשר'],
      'keywords': [
        // משפחה / גירושין
        'עורך דין משפחה קריית גת','עורך דין משפחה קרית גת',
        'משרד עורכי דין משפחה קריית גת','משרד עורכי דין משפחה קרית גת',
        'עו״ד גירושין קריית גת','עו״ד גירושין קרית גת','עורך דין גירושין קריית גת','עורך דין גירושין קרית גת',
        // נדל״ן / נדלן
        'עורך דין נדל״ן קריית גת','עורך דין נדל״ן קרית גת','עורך דין נדלן קריית גת','עורך דין נדלן קרית גת',
        'משרד עורכי דין נדל״ן','משרד עורכי דין נדלן',
        // גישור / מגשר
        'גישור קריית גת','גישור קרית גת','מגשר קריית גת','מגשר קרית גת','מגשרים קריית גת','מגשרים קרית גת'
      ],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'רחוב חשוון 10, קומה ג׳ (מתחם פבליקו)',
        'addressLocality': 'קריית גת',
        'addressRegion': 'מחוז הדרום',
        'addressCountry': 'IL'
      },
      'areaServed': ['קריית גת','קרית גת','בית שמש','ירושלים','הדרום'],
      'contactPoint': [
        { '@type': 'ContactPoint', 'telephone': '+972-52-6706744', 'contactType': 'customer service', 'areaServed': ['IL'], 'availableLanguage': ['he'] },
        { '@type': 'ContactPoint', 'telephone': '+972-54-6949137', 'contactType': 'customer service', 'areaServed': ['IL'], 'availableLanguage': ['he'] }
      ],
      'openingHoursSpecification': [{
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
        'opens': '09:00',
        'closes': '18:00'
      }],
      'sameAs': ['https://www.facebook.com/profile.php?id=61560157382416'],
      'priceRange': '₪₪'
    });

    // ===== Breadcrumbs =====
    this.upsertJsonLd('contact-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'דף הבית', 'item': 'https://cohenkazaz.law/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'צור קשר', 'item': canonical }
      ]
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
