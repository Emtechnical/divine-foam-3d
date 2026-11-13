import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Menu, X, MapPin, Phone, Mail, MessageCircle, Home as HomeIcon } from 'lucide-react';
import { copy, type Language } from './content';
import MaterialScene from './three/MaterialScene';
import CinematicShowroom from './three/CinematicShowroom';
import Atmosphere from './Atmosphere';
import { divineAssets } from './assets';

const whatsapp = 'https://wa.me/919724415440';
const categories = [
  { key: 0, number: '01', art: 'foam', image: '', imageAlt: '' },
  { key: 1, number: '02', art: 'mattress', image: divineAssets.mattressCushion.src, imageAlt: divineAssets.mattressCushion.alt },
  { key: 2, number: '03', art: 'rebond', image: divineAssets.rebondedFoam.src, imageAlt: divineAssets.rebondedFoam.alt },
  { key: 3, number: '04', art: 'fabric', image: divineAssets.sofaFabric.src, imageAlt: divineAssets.sofaFabric.alt },
  { key: 4, number: '05', art: 'recron', image: divineAssets.recronPadding.src, imageAlt: divineAssets.recronPadding.alt },
  { key: 5, number: '06', art: 'adhesive', image: divineAssets.liningHardware.src, imageAlt: divineAssets.liningHardware.alt },
];

export default function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('divine-language') as Language) || 'en');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];

  useEffect(() => {
    localStorage.setItem('divine-language', language);
    document.documentElement.lang = language === 'gu' ? 'gu' : 'en';
  }, [language]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.intro-grid, .section-heading, .category-card, .business-inner, .audience-row, .brands-section h2, .brand-list span, .contact-copy, .contact-details > *'
    );
    if (!('IntersectionObserver' in window)) {
      targets.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const changeLanguage = () => setLanguage(language === 'en' ? 'gu' : 'en');
  const closeMenu = () => setMenuOpen(false);

  return <div className={language === 'gu' ? 'site gujarati' : 'site'}>
    <Atmosphere />
    <header className="header">
      <a className="brand" href="#top" aria-label="Divine Foam & Mattress home">
        <img className="brand-logo" src={divineAssets.logo} alt="Divine Foam & Mattress logo" />
      </a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        <a href="#top" onClick={closeMenu}><HomeIcon size={15}/>{t.nav.home}</a>
        <a href="#materials" onClick={closeMenu}>{t.nav.materials}</a>
        <a href="#business" onClick={closeMenu}>{t.nav.business}</a>
        <a href="#brands" onClick={closeMenu}>{t.nav.brands}</a>
        <a href="#about" onClick={closeMenu}>{t.nav.about}</a>
        <a href="#contact" onClick={closeMenu}>{t.nav.contact}</a>
      </nav>
      <div className="header-actions">
        <button className="language-toggle" onClick={changeLanguage} aria-label="Switch website language">{language === 'en' ? 'ગુજરાતી' : 'EN'}</button>
        <a className="header-cta" href={whatsapp} target="_blank" rel="noreferrer">{t.enquire}<ArrowUpRight size={15}/></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-ambient" aria-hidden="true"><span className="ambient-orb orb-a"/><span className="ambient-orb orb-b"/><span className="ambient-orb orb-c"/></div>
        <div className="hero-copy">
          <div className="eyebrow"><span/> {t.eyebrow}</div>
          <h1>{t.heroTitle}</h1>
          <p className="hero-description">{t.heroBody}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#materials">{t.explore}<ArrowDownRight size={17}/></a>
            <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">{t.enquire}<ArrowUpRight size={16}/></a>
          </div>
          <div className="hero-meta"><span>01 / 06</span><i/> <span>NADIAD · GUJARAT</span></div>
        </div>
        <div className="hero-art"><MaterialScene/><div className="art-side-note">FOAM / FABRIC / COMFORT</div></div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-line"/></div>
      </section>

      <CinematicShowroom language={language}/>

      <section className="intro-section section-wrap" id="about">
        <div className="section-kicker">{t.introEyebrow}</div>
        <div className="intro-grid"><h2>{t.introTitle}</h2><p>{t.introBody}</p></div>
      </section>

      <section className="catalogue-section section-wrap" id="materials">
        <div className="section-heading"><div><div className="section-kicker">{t.catalogueEyebrow}</div><h2>{t.catalogueTitle}</h2></div><p>{t.catalogueBody}</p></div>
        <div className="category-grid">
          {categories.map((category) => <a className="category-card" href={whatsapp + '?text=' + encodeURIComponent('Hello Divine Foam & Mattress, I would like to enquire about ' + copy.en.categories[category.key][0] + '.') } target="_blank" rel="noreferrer" key={category.number}>
            <div className={'category-art art-' + category.art}><span className="category-number">{category.number}</span>{category.image ? <img src={category.image} alt={category.imageAlt || t.categories[category.key][0]} loading="lazy" decoding="async"/> : <div className="category-shape"/>}</div>
            <div className="category-info"><div><h3>{t.categories[category.key][0]}</h3><p>{t.categories[category.key][1]}</p></div><span className="round-arrow"><ArrowUpRight size={17}/></span></div>
          </a>)}
        </div>
      </section>

      <section className="business-section" id="business"><div className="section-wrap business-inner">
        <div><div className="section-kicker">{t.nav.business}</div><h2>{t.pathwaysTitle}</h2><p>{t.pathwaysBody}</p></div>
        <div className="audience-list">{t.audiences.map((audience, i) => <div className="audience-row" key={audience}><span>0{i+1}</span><b>{audience}</b><ArrowUpRight size={18}/></div>)}</div>
      </div></section>

      <section className="brands-section section-wrap" id="brands"><div className="section-kicker">TRUSTED SUPPLY NETWORK</div><h2>{t.brandTitle}</h2><div className="brand-list">{['Kurl-On', 'Prime Comfort', 'Jindal', 'Flexipol / Resiflex', 'Pidilite / Fevicol'].map((brand) => <span key={brand}>{brand}</span>)}</div><p className="brand-note">Authorized Dealer — Pidilite / Fevicol</p></section>

      <section className="contact-section" id="contact"><div className="section-wrap contact-inner">
        <div className="contact-copy"><div className="section-kicker">DIVINE FOAM & MATTRESS · NADIAD</div><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/>{t.whatsapp}<ArrowUpRight size={16}/></a></div>
        <div className="contact-details">
          <a href="tel:+919724415440"><Phone/><span><small>PHONE / WHATSAPP</small>+91 97244 15440</span></a>
          <a href="mailto:divinesleepsol@gmail.com"><Mail/><span><small>EMAIL</small>divinesleepsol@gmail.com</span></a>
          <div><MapPin/><span><small>VISIT US</small>Pij Road, near MF Furniture,<br/>Nadiad, Gujarat 387002</span></div>
        </div>
      </div></section>
    </main>

    <a className="floating-home" href="#top" aria-label={t.nav.home}><HomeIcon size={17}/><span>{t.nav.home}</span></a>
    <footer className="footer"><a className="footer-home" href="#top"><b>DIVINE FOAM & MATTRESS</b></a><span>{t.footerNote}</span><a href="#top" className="back-top">BACK TO TOP ↑</a></footer>
  </div>;
}
