// ==================== NAVIGATION ====================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const fullscreenMenu = document.getElementById('fullscreenMenu');
const menuClose = document.getElementById('menuClose');
const fullscreenLinks = document.querySelectorAll('.fullscreen-link');
const navLinks = document.querySelectorAll('.fullscreen-link[href^="#"]');

// Open fullscreen menu
navToggle.addEventListener('click', () => {
    fullscreenMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    highlightActiveMenuLink();
});

// Close fullscreen menu
function closeMenu() {
    fullscreenMenu.classList.remove('active');
    document.body.style.overflow = '';
}

menuClose.addEventListener('click', closeMenu);

// Close menu when clicking on a link
fullscreenLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Highlight active menu link based on current page
function highlightActiveMenuLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Remove active class from all links
    fullscreenLinks.forEach(link => {
        link.classList.remove('active-page');
    });

    // Add active class to current page link
    fullscreenLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        // Handle home page
        if ((currentPage === 'index.html' || currentPage === '') &&
            (linkHref === '#home' || linkHref === 'index.html')) {
            link.classList.add('active-page');
        }
        // Handle other pages
        else if (linkHref && linkHref.includes(currentPage) && currentPage !== 'index.html') {
            link.classList.add('active-page');
        }
    });
}

// Language selection & translations
const langButtons = document.querySelectorAll('.lang-btn');
const i18nElements = document.querySelectorAll('[data-i18n]');
const LANG_STORAGE_KEY = 'bagnovega-lang';
const LANG_QUERY_PARAM = 'lang';
const THEME_QUERY_PARAM = 'theme';
const THEME_DEFAULT = (window.__bagnovegaTheme && window.__bagnovegaTheme.defaultTheme) || 'dark';
let currentLanguage;
let currentThemeMode = document.documentElement.dataset.theme || THEME_DEFAULT;

function readStoredLanguage() {
    try {
        const value = localStorage.getItem(LANG_STORAGE_KEY);
        if (value) return value;
    } catch (error) {
        // localStorage might be disabled; fall back to cookies
    }
    const match = document.cookie.match(new RegExp(`${LANG_STORAGE_KEY}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function persistLanguage(lang) {
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (error) {
        document.cookie = `${LANG_STORAGE_KEY}=${encodeURIComponent(lang)};path=/;max-age=31536000`;
    }
}

function getThemeFromUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(THEME_QUERY_PARAM);
        return value === 'light' || value === 'dark' ? value : null;
    } catch (error) {
        return null;
    }
}

function updateUrlThemeParam(theme) {
    if (!theme) return;
    try {
        const url = new URL(window.location.href);
        if (url.searchParams.get(THEME_QUERY_PARAM) === theme) return;
        url.searchParams.set(THEME_QUERY_PARAM, theme);
        const newUrl = `${url.pathname}${url.search}${url.hash}`;
        window.history.replaceState({}, '', newUrl);
    } catch (error) {
        // Ignore environments without URL/History support
    }
}

const translations = {
    it: {
        'nav.book': 'PRENOTA',
        'nav.home': 'HOME',
        'nav.services': 'SERVIZI',
        'nav.menu': 'MENU',
        'nav.prices': 'PREZZI',
        'nav.gallery': 'GALLERIA',
        'nav.contacts': 'CONTATTI',
        'menu.phoneLabel': 'Tel:',
        'menu.mobileLabel': 'Cell:',
        'menu.mailLabel': 'M:',
        'menu.weatherToday': 'Oggi',
        'intro.title': 'Benvenuti al Bagno Vega 101',
        'intro.body': 'Dal cuore della Riviera Romagnola, a Zadina di Cesenatico, vi accogliamo nel nostro stabilimento balneare, dove mare, comfort e tradizione si uniscono al calore di un\'ospitalit\u00e0 familiare.',
        'intro.servicesLink': 'Servizi',
        'intro.menuLink': 'Menu',
        'intro.pricesLink': 'Prezzi',
        'intro.contactsLink': 'Contatti',
        'quote.text': '&ldquo;Il mare, una volta lanciato il suo incantesimo, ti tiene per sempre nella sua rete di meraviglia&rdquo;',
        'quote.author': '&mdash; Jacques Cousteau',
        'footer.tagline': 'Il tuo stabilimento balneare a Cesenatico',
        'footer.linksTitle': 'Link Utili',
        'footer.homeLink': 'Home',
        'footer.servicesLink': 'Servizi',
        'footer.menuLink': 'Menu',
        'footer.pricesLink': 'Prezzi',
        'footer.galleryLink': 'Galleria',
        'footer.contactsLink': 'Contatti',
        'footer.contactTitle': 'Contatti',
        'footer.location': 'Zadina di Cesenatico',
        'footer.hours': 'Lun - Dom: 7:00 - 21:00',
        'footer.season': '(durante la stagione estiva)',
        'footer.copyright': '&copy; 2025 Bagno Vega 101. Tutti i diritti riservati.',
        'footer.privacyLink': 'Privacy Policy',
        'contact.heroTitle': 'Contatti',
        'contact.address': 'Via Arenile Demaniale, 101<br>47042 Zadina di Cesenatico (FC)',
        'contact.phoneTitle': 'Telefono',
        'contact.emailTitle': 'Email',
        'contact.hoursTitle': 'Orari',
        'contact.hoursRange': 'Luned\u00ec - Domenica<br>7:00 - 21:00',
        'contact.hoursNote': 'Durante la stagione estiva',
        'contact.socialTitle': 'Social',
        'contact.formTitle': 'Scrivici',
        'contact.formIntro': 'Per prenotazioni, informazioni o richieste generali, compila il modulo sottostante. Ti risponderemo al pi\u00f9 presto.',
        'contact.nameLabel': 'Nome e Cognome',
        'contact.emailLabel': 'Email',
        'contact.phoneLabel': 'Telefono',
        'contact.messageLabel': 'Messaggio',
        'contact.submit': 'Invia Messaggio',
        'services.heroTitle': 'I Nostri Servizi',
        'services.items.ombrelloni.title': '80 Ombrelloni',
        'services.items.ombrelloni.body': 'Il nostro stabilimento dispone di 80 ombrelloni spaziosi e ben distanziati per garantire privacy e comfort durante la vostra giornata al mare. Ogni postazione \u00e8 dotata di lettini di qualit\u00e0 e pu\u00f2 essere personalizzata secondo le vostre esigenze.',
        'services.items.ristorante.title': 'Ristorante',
        'services.items.ristorante.body': 'Cucina di qualit\u00e0 con prodotti freschi e locali. Specialit\u00e0 di pesce, pane fatto in casa ogni giorno e piatti della tradizione romagnola rivisitati con un tocco moderno.',
        'services.items.ristorante.cta': 'Scopri di pi\u00f9 \u2192',
        'services.items.bar.title': 'Bar & Caffetteria',
        'services.items.bar.body': 'Caff\u00e8 selezionati, bevande fresche e una selezione di aperitivi per accompagnare i vostri momenti di relax. Il nostro bar \u00e8 aperto tutto il giorno per servirvi.',
        'services.items.volley.title': 'Beach Volley, Ping Pong e Basket',
        'services.items.volley.body': 'Campo da beach volley disponibile per gli amanti dello sport e del divertimento. Inoltre, abbiamo un campo da ping pong e un canestro per il basket. Porta i tuoi amici e goditi momenti di sport e svago all\'aria aperta.',
        'services.items.docce.title': 'Docce & Servizi',
        'services.items.docce.body': 'Docce calde gratuite, spogliatoi puliti e cabine private per garantire il massimo comfort durante la vostra permanenza.',
        'services.items.cani.title': 'Area Cani',
        'services.items.cani.body': 'Area dedicata ai nostri amici a quattro zampe, attrezzata con ombrelloni, lettini, ciotole per acqua fresca e accesso diretto al mare. Il vostro cane \u00e8 il benvenuto nella zona dedicata.',
        'menu.heroTitle': 'Menu',
        'menu.intro.title': 'Il Ristorante',
        'menu.intro.body': 'Mangiare, oltre a essere una necessit\u00e0 per il fisico, ha un indiscutibile valore culturale ed etico. Le nostre preferenze in fatto di cibo, ma anche il modo in cui lo scegliamo e lo conserviamo senza sprecarlo, raccontano chi siamo e i valori che ci rappresentano. Tanto \u00e8 vero che dai nostri fornitori scegliamo gli alimenti che ci ispirano di pi\u00f9, non solo per come immaginiamo che sapranno saziare il corpo appagando il palato, ma soprattutto per come sapranno confermare la nostra identit\u00e0 pi\u00f9 profonda.',
        'menu.tags.sustainable': 'Cucina sostenibile',
        'menu.tags.local': 'Prodotti locali',
        'menu.tags.suppliers': 'Fornitori selezionati',
        'menu.items.pane.title': 'Pane Fatto in Casa',
        'menu.items.pane.body': 'Pane fresco sfornato ogni giorno con ingredienti genuini. La fragranza del pane appena uscito dal forno accoglie i nostri ospiti ogni mattina.',
        'menu.items.pesce.title': 'Piatti a Base di Pesce Fresco',
        'menu.items.pesce.body': 'Specialit\u00e0 di mare preparate dalle nostre chef che ogni giorno selezionano con cura materie prime fresche e di qualit\u00e0.',
        'menu.items.aperitivi.title': 'Aperitivi Vista Mare',
        'menu.items.aperitivi.body': 'Cocktail e drink vista mare, accompagnati da sfiziosissimi aperitivi. Il momento perfetto per rilassarsi guardando il tramonto sulla Riviera.',
        'menu.items.tradizione.title': 'Cucina dai sapori tradizionali',
        'menu.items.tradizione.body': 'I sapori autentici della tradizione romagnola rivisitati con creativit\u00e0. Dalle piadine ai primi piatti, ogni ricetta racconta la nostra terra.',
        'menu.cta.title': 'Scarica il Nostro Menu Completo',
        'menu.cta.body': 'Scopri tutte le nostre specialit\u00e0, i piatti del giorno e le proposte stagionali',
        'menu.cta.button': 'Scarica Menu PDF',
        'pricing.heroTitle': 'Prezzi',
        'pricing.intro': 'I nostri prezzi variano in base al periodo e alla posizione dell\'ombrellone. Contattateci per ricevere un preventivo personalizzato e scoprire le nostre offerte speciali per famiglie e soggiorni prolungati.',
        'pricing.seasonal.title': 'Stagionale',
        'pricing.seasonal.body': 'Prenota il tuo ombrellone per tutta la stagione e approfitta delle nostre tariffe vantaggiose. Include tutti i servizi dello stabilimento.',
        'pricing.seasonal.cta': 'Richiedi informazioni',
        'pricing.daily.title': 'Giornaliero',
        'pricing.daily.body': 'Tariffe flessibili per chi desidera trascorrere una giornata al mare senza impegno. Disponibilit\u00e0 soggetta a prenotazione.',
        'pricing.daily.cta': 'Contattaci',
        'pricing.weekly.title': 'Settimanale',
        'pricing.weekly.body': 'Ideale per soggiorni brevi, le nostre tariffe settimanali offrono un eccellente rapporto qualit\u00e0-prezzo.',
        'pricing.weekly.cta': 'Scopri di pi\u00f9',
        'pricing.features.title': 'Cosa Include',
        'pricing.features.loungers.title': 'Lettini e ombrellone',
        'pricing.features.loungers.body': 'Postazione completa con lettini di qualit\u00e0',
        'pricing.features.showers.title': 'Docce calde gratuite',
        'pricing.features.showers.body': 'Servizi igienici sempre puliti e curati',
        'pricing.features.volley.title': 'Campo beach volley',
        'pricing.features.volley.body': 'Accesso libero al campo sportivo',
        'pricing.features.wifi.title': 'Wi-Fi gratuito',
        'pricing.features.wifi.body': 'Connessione internet in tutto lo stabilimento',
        'pricing.cta.title': 'Prenota Ora',
        'pricing.cta.body': 'Contattaci per ricevere un preventivo personalizzato e prenotare il tuo posto al sole',
        'pricing.cta.button': 'Contattaci',
        'gallery.heroTitle': 'Galleria',
        'gallery.intro': 'Scopri il Bagno Vega 101 attraverso le immagini: dalla spiaggia attrezzata alle aree relax, dai tramonti mozzafiato ai momenti di convivialit\u00e0.',
        'gallery.cta.title': 'Vieni a Trovarci',
        'gallery.cta.body': 'Prenota il tuo ombrellone e vivi l\'esperienza Bagno Vega 101',
        'gallery.cta.button': 'Contattaci',
        'services.items.cani.cta': 'Scopri il regolamento →',
        'privacy.heroTitle': 'Privacy Policy',
        'privacy.intro': '<h2>Informativa sulla Privacy</h2><p>Il Bagno Vega 101 rispetta la privacy dei propri utenti e si impegna a proteggere i dati personali raccolti attraverso questo sito web.</p>',
        'privacy.section1': '<h3>1. Titolare del Trattamento</h3><p>Il titolare del trattamento dei dati è:</p><p><strong>Bagno Vega 101</strong><br>Via Arenile Demaniale, 101<br>47042 Zadina di Cesenatico (FC)<br>P.IVA: 03724890409<br>Email: bagnovega101@gmail.com<br>Tel: 0547 82127</p>',
        'privacy.section2': '<h3>2. Dati Raccolti</h3><p>Raccogliamo i seguenti dati personali quando ci contatti tramite il modulo presente sul sito:</p><ul><li>Nome e cognome</li><li>Indirizzo email</li><li>Numero di telefono (facoltativo)</li><li>Messaggio o richiesta</li></ul>',
        'privacy.section3': '<h3>3. Finalità del Trattamento</h3><p>I dati personali raccolti vengono utilizzati esclusivamente per:</p><ul><li>Rispondere alle richieste di informazioni</li><li>Gestire prenotazioni e servizi richiesti</li><li>Fornire assistenza ai clienti</li></ul>',
        'privacy.section4': '<h3>4. Base Giuridica del Trattamento</h3><p>Il trattamento dei dati personali si basa sul consenso dell\'interessato e sulla necessità di eseguire le richieste formulate.</p>',
        'privacy.section5': '<h3>5. Modalità di Trattamento</h3><p>I dati personali sono trattati con strumenti elettronici e sono conservati in modo sicuro. Adottiamo misure di sicurezza tecniche e organizzative per proteggere i dati da accessi non autorizzati, perdita o distruzione.</p>',
        'privacy.section6': '<h3>6. Conservazione dei Dati</h3><p>I dati personali saranno conservati per il tempo strettamente necessario a evadere le richieste e per i termini previsti dalla legge.</p>',
        'privacy.section7': '<h3>7. Comunicazione e Diffusione dei Dati</h3><p>I dati personali non verranno comunicati a terzi né diffusi senza il consenso esplicito dell\'interessato, salvo obblighi di legge.</p>',
        'privacy.section8': '<h3>8. Diritti dell\'Interessato</h3><p>Ai sensi del Regolamento UE 2016/679 (GDPR), l\'interessato ha diritto di:</p><ul><li>Accedere ai propri dati personali</li><li>Richiedere la rettifica o la cancellazione dei dati</li><li>Limitare il trattamento dei dati</li><li>Opporsi al trattamento</li><li>Richiedere la portabilità dei dati</li><li>Revocare il consenso in qualsiasi momento</li></ul><p>Per esercitare i propri diritti, è possibile contattarci all\'indirizzo email: bagnovega101@gmail.com</p>',
        'privacy.section9': '<h3>9. Cookie</h3><p>Questo sito utilizza solo cookie tecnici necessari per il funzionamento del sito stesso (ad esempio, per memorizzare le preferenze di lingua). Non utilizziamo cookie di profilazione o di terze parti per scopi pubblicitari.</p>',
        'privacy.section10': '<h3>10. Modifiche alla Privacy Policy</h3><p>Ci riserviamo il diritto di modificare questa informativa sulla privacy in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.</p><p><strong>Ultimo aggiornamento:</strong> Gennaio 2025</p>',
        'privacy.backToHome': '← TORNA ALLA HOME',
        'dogRules.heroTitle': 'Regolamento Area Cani',
        'dogRules.backToServices': '← TORNA AI SERVIZI'
    },
    en: {
        'nav.book': 'BOOK NOW',
        'nav.home': 'HOME',
        'nav.services': 'SERVICES',
        'nav.menu': 'MENU',
        'nav.prices': 'PRICES',
        'nav.gallery': 'GALLERY',
        'nav.contacts': 'CONTACTS',
        'menu.phoneLabel': 'Phone:',
        'menu.mobileLabel': 'Mobile:',
        'menu.mailLabel': 'Email:',
        'menu.weatherToday': 'Today',
        'intro.title': 'Welcome to Bagno Vega 101',
        'intro.body': 'From the heart of the Romagna Riviera in Zadina di Cesenatico, we welcome you to our beach club, where sea, comfort and tradition come together with the warmth of family hospitality.',
        'intro.servicesLink': 'Services',
        'intro.menuLink': 'Menu',
        'intro.pricesLink': 'Prices',
        'intro.contactsLink': 'Contact us',
        'quote.text': '&ldquo;The sea, once it casts its spell, holds you in its net of wonder forever.&rdquo;',
        'quote.author': '&mdash; Jacques Cousteau',
        'footer.tagline': 'Your beach club in Cesenatico',
        'footer.linksTitle': 'Useful Links',
        'footer.homeLink': 'Home',
        'footer.servicesLink': 'Services',
        'footer.menuLink': 'Menu',
        'footer.pricesLink': 'Prices',
        'footer.galleryLink': 'Gallery',
        'footer.contactsLink': 'Contacts',
        'footer.contactTitle': 'Contacts',
        'footer.location': 'Zadina di Cesenatico',
        'footer.hours': 'Mon - Sun: 7:00 - 21:00',
        'footer.season': '(during the summer season)',
        'footer.copyright': '&copy; 2025 Bagno Vega 101. All rights reserved.',
        'footer.privacyLink': 'Privacy Policy',
        'contact.heroTitle': 'Contacts',
        'contact.address': 'Via Arenile Demaniale, 101<br>47042 Zadina di Cesenatico (FC)',
        'contact.phoneTitle': 'Phone',
        'contact.emailTitle': 'Email',
        'contact.hoursTitle': 'Opening hours',
        'contact.hoursRange': 'Monday - Sunday<br>7:00 - 21:00',
        'contact.hoursNote': 'During the summer season',
        'contact.socialTitle': 'Social',
        'contact.formTitle': 'Write to us',
        'contact.formIntro': 'For bookings, information or general inquiries, fill in the form below. We will get back to you as soon as possible.',
        'contact.nameLabel': 'First and Last Name',
        'contact.emailLabel': 'Email',
        'contact.phoneLabel': 'Phone',
        'contact.messageLabel': 'Message',
        'contact.submit': 'Send Message',
        'services.heroTitle': 'Our Services',
        'services.items.ombrelloni.title': '80 Beach Umbrellas',
        'services.items.ombrelloni.body': 'Our beach club offers 80 generously spaced umbrellas to ensure privacy and comfort throughout your day by the sea. Every setup includes premium loungers and can be tailored to your needs.',
        'services.items.ristorante.title': 'The Restaurant',
        'services.items.ristorante.body': 'Quality cuisine made with fresh, local ingredients. Sea specialities, home-baked bread every day, and Romagna classics reimagined with a modern twist.',
        'services.items.ristorante.cta': 'Discover more \u2192',
        'services.items.bar.title': 'Bar & Coffee',
        'services.items.bar.body': 'Selected coffees, refreshing drinks, and a curated aperitivo menu to accompany every moment of relaxation. Our bar stays open all day to serve you.',
        'services.items.volley.title': 'Beach Volley, Ping Pong & Basketball',
        'services.items.volley.body': 'A beach-volley court ready for sports lovers and fun seekers. We also have a ping pong table and a basketball hoop. Bring your friends and enjoy moments of sport and fun outdoors.',
        'services.items.docce.title': 'Showers & Facilities',
        'services.items.docce.body': 'Complimentary hot showers, spotless changing rooms, and private cabins to keep you comfortable all day long.',
        'services.items.cani.title': 'Dog-Friendly Area',
        'services.items.cani.body': 'A dedicated zone for four-legged friends with umbrellas, loungers, fresh water bowls, and direct beach access. Your dog is welcome in the reserved area.',
        'menu.heroTitle': 'Menu',
        'menu.intro.title': 'Restaurant',
        'menu.intro.body': 'Eating is more than a physical need: it carries undeniable cultural and ethical value. The food we prefer, the way we choose it, and how we store it without waste all tell the story of who we are. That is why we select the ingredients that inspire us most, not only for how they satisfy the palate, but for how they reflect our deepest identity.',
        'menu.tags.sustainable': 'Sustainable cuisine',
        'menu.tags.local': 'Local products',
        'menu.tags.suppliers': 'Selected suppliers',
        'menu.items.pane.title': 'Homemade Bread',
        'menu.items.pane.body': 'Fresh bread baked every day with genuine ingredients. Its warm fragrance welcomes our guests each morning.',
        'menu.items.pesce.title': 'Fresh Seafood Dishes',
        'menu.items.pesce.body': 'Seafood specialties prepared by our chefs who carefully select fresh, quality ingredients every day.',
        'menu.items.aperitivi.title': 'Seaside Aperitifs',
        'menu.items.aperitivi.body': 'Cocktails and drinks by the sea paired with flavourful bites\u2014the perfect time to unwind while watching the Riviera sunset.',
        'menu.items.tradizione.title': 'Traditional Flavors Cuisine',
        'menu.items.tradizione.body': 'Authentic Romagnole flavours revisited with creativity. From piadine to pasta dishes, every recipe tells our story.',
        'menu.cta.title': 'Download Our Full Menu',
        'menu.cta.body': 'Browse every speciality, daily dish, and seasonal proposal.',
        'menu.cta.button': 'Download PDF Menu',
        'pricing.heroTitle': 'Prices',
        'pricing.intro': 'Our rates change according to the period and umbrella position. Get in touch for a tailored quote and learn about family deals or long-stay offers.',
        'pricing.seasonal.title': 'Seasonal',
        'pricing.seasonal.body': 'Reserve your umbrella for the whole season and enjoy our best rates. Includes every facility in the beach club.',
        'pricing.seasonal.cta': 'Request information',
        'pricing.daily.title': 'Daily',
        'pricing.daily.body': 'Flexible rates for guests who want a carefree day at the beach. Availability subject to reservation.',
        'pricing.daily.cta': 'Contact us',
        'pricing.weekly.title': 'Weekly',
        'pricing.weekly.body': 'Perfect for short stays, our weekly packages offer outstanding value for money.',
        'pricing.weekly.cta': 'Learn more',
        'pricing.features.title': 'What\u2019s Included',
        'pricing.features.loungers.title': 'Loungers & Umbrella',
        'pricing.features.loungers.body': 'A complete setup with premium loungers',
        'pricing.features.showers.title': 'Complimentary Hot Showers',
        'pricing.features.showers.body': 'Well-kept and spotless restrooms',
        'pricing.features.volley.title': 'Beach-Volley Court',
        'pricing.features.volley.body': 'Free access to the sports court',
        'pricing.features.wifi.title': 'Free Wi-Fi',
        'pricing.features.wifi.body': 'Internet coverage across the whole beach club',
        'pricing.cta.title': 'Book Now',
        'pricing.cta.body': 'Contact us for a bespoke quote and secure your spot under the sun.',
        'pricing.cta.button': 'Contact us',
        'gallery.heroTitle': 'Gallery',
        'gallery.intro': 'Discover Bagno Vega 101 through images: from the equipped beach to relax areas, breathtaking sunsets, and shared moments.',
        'gallery.cta.title': 'Come Visit Us',
        'gallery.cta.body': 'Book your umbrella and live the Bagno Vega 101 experience.',
        'gallery.cta.button': 'Contact us',
        'services.items.cani.cta': 'Discover the rules →',
        'privacy.heroTitle': 'Privacy Policy',
        'privacy.intro': '<h2>Privacy Policy</h2><p>Bagno Vega 101 respects the privacy of its users and is committed to protecting personal data collected through this website.</p>',
        'privacy.section1': '<h3>1. Data Controller</h3><p>The data controller is:</p><p><strong>Bagno Vega 101</strong><br>Via Arenile Demaniale, 101<br>47042 Zadina di Cesenatico (FC)<br>VAT: 03724890409<br>Email: bagnovega101@gmail.com<br>Phone: 0547 82127</p>',
        'privacy.section2': '<h3>2. Data Collected</h3><p>We collect the following personal data when you contact us via the form on the site:</p><ul><li>First and last name</li><li>Email address</li><li>Phone number (optional)</li><li>Message or request</li></ul>',
        'privacy.section3': '<h3>3. Purpose of Processing</h3><p>Personal data collected is used exclusively to:</p><ul><li>Respond to information requests</li><li>Manage bookings and requested services</li><li>Provide customer support</li></ul>',
        'privacy.section4': '<h3>4. Legal Basis for Processing</h3><p>The processing of personal data is based on the consent of the data subject and the necessity to execute the requests made.</p>',
        'privacy.section5': '<h3>5. Processing Methods</h3><p>Personal data is processed using electronic tools and stored securely. We adopt technical and organizational security measures to protect data from unauthorized access, loss, or destruction.</p>',
        'privacy.section6': '<h3>6. Data Retention</h3><p>Personal data will be retained for the time strictly necessary to fulfill the requests and for the terms required by law.</p>',
        'privacy.section7': '<h3>7. Data Communication and Disclosure</h3><p>Personal data will not be communicated to third parties or disclosed without the explicit consent of the data subject, except for legal obligations.</p>',
        'privacy.section8': '<h3>8. Data Subject Rights</h3><p>Under EU Regulation 2016/679 (GDPR), the data subject has the right to:</p><ul><li>Access their personal data</li><li>Request correction or deletion of data</li><li>Limit data processing</li><li>Object to processing</li><li>Request data portability</li><li>Withdraw consent at any time</li></ul><p>To exercise your rights, please contact us at: bagnovega101@gmail.com</p>',
        'privacy.section9': '<h3>9. Cookies</h3><p>This site only uses technical cookies necessary for the functioning of the site itself (for example, to store language preferences). We do not use profiling or third-party cookies for advertising purposes.</p>',
        'privacy.section10': '<h3>10. Changes to Privacy Policy</h3><p>We reserve the right to modify this privacy policy at any time. Changes will be published on this page.</p><p><strong>Last updated:</strong> January 2025</p>',
        'privacy.backToHome': '← BACK TO HOME',
        'dogRules.heroTitle': 'Dog-Friendly Area Rules',
        'dogRules.backToServices': '← BACK TO SERVICES'
    }
};

function getLanguageFromUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        const langFromUrl = params.get(LANG_QUERY_PARAM);
        return translations[langFromUrl] ? langFromUrl : null;
    } catch (error) {
        return null;
    }
}

function updateUrlLanguageParam(lang) {
    try {
        const url = new URL(window.location.href);
        if (url.searchParams.get(LANG_QUERY_PARAM) === lang) return;
        url.searchParams.set(LANG_QUERY_PARAM, lang);
        const newUrl = `${url.pathname}${url.search}${url.hash}`;
        window.history.replaceState({}, '', newUrl);
    } catch (error) {
        // Ignore environments where URL or history APIs are unavailable
    }
}

const LINK_PROTOCOL_EXCLUDE = /^(?:mailto:|tel:|sms:|whatsapp:|viber:|geo:|javascript:)/i;
const HTML_PAGE_PATTERN = /\.html?(?:$|[?#])/i;

function shouldLocalizeLink(href) {
    if (!href || href.startsWith('#')) return false;
    if (LINK_PROTOCOL_EXCLUDE.test(href)) return false;
    if (/^(?:https?:)?\/\//i.test(href) && !href.startsWith(window.location.origin)) return false;
    return HTML_PAGE_PATTERN.test(href);
}

function updateStateAwareLinks(lang, theme) {
    const targetLang = lang || 'it';
    const targetTheme = theme === 'light' ? 'light' : 'dark';

    document.querySelectorAll('a[href]').forEach(anchor => {
        const rawHref = anchor.getAttribute('href');
        if (!shouldLocalizeLink(rawHref)) return;

        try {
            const url = new URL(anchor.href, window.location.href);
            let modified = false;
            if (url.searchParams.get(LANG_QUERY_PARAM) !== targetLang) {
                url.searchParams.set(LANG_QUERY_PARAM, targetLang);
                modified = true;
            }
            if (url.searchParams.get(THEME_QUERY_PARAM) !== targetTheme) {
                url.searchParams.set(THEME_QUERY_PARAM, targetTheme);
                modified = true;
            }
            if (modified) {
                anchor.href = url.href;
            }
        } catch (error) {
            try {
                const [pathAndQuery = '', hash] = rawHref.split('#');
                const [path, query = ''] = pathAndQuery.split('?');
                const params = new URLSearchParams(query);
                params.set(LANG_QUERY_PARAM, targetLang);
                params.set(THEME_QUERY_PARAM, targetTheme);
                const queryString = params.toString();
                const newHref = `${path}${queryString ? `?${queryString}` : ''}${hash ? `#${hash}` : ''}`;
                anchor.setAttribute('href', newHref);
            } catch (fallbackError) {
                const base = rawHref.split('#')[0];
                const hashFragment = rawHref.includes('#') ? `#${rawHref.split('#')[1]}` : '';
                const separator = base.includes('?') ? '&' : '?';
                const newHref = `${base}${separator}${LANG_QUERY_PARAM}=${targetLang}&${THEME_QUERY_PARAM}=${targetTheme}${hashFragment}`;
                anchor.setAttribute('href', newHref);
            }
        }
    });
}

function getActiveLanguage() {
    return currentLanguage || document.documentElement.lang || 'it';
}

function translateElement(el, lang) {
    const key = el.dataset.i18n;
    const dictionary = translations[lang];
    if (!key || !dictionary || !(key in dictionary)) return;

    if (el.dataset.i18nType === 'html') {
        el.innerHTML = dictionary[key];
    } else {
        el.textContent = dictionary[key];
    }
}

function setLanguage(lang, persist = true) {
    const targetLang = translations[lang] ? lang : 'it';
    if (targetLang === currentLanguage && persist) {
        persistLanguage(targetLang);
        return;
    }

    langButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.lang === targetLang);
    });

    i18nElements.forEach(el => translateElement(el, targetLang));
    document.documentElement.lang = targetLang;
    currentLanguage = targetLang;
    updateUrlLanguageParam(targetLang);
    updateStateAwareLinks(targetLang, currentThemeMode || THEME_DEFAULT);

    if (persist) {
        persistLanguage(targetLang);
    }
}

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        setLanguage(button.dataset.lang);
    });
});

const urlLanguage = getLanguageFromUrl();
const storedLanguage = readStoredLanguage();
const detectedLanguage = document.documentElement.lang || 'it';
const initialLanguage = urlLanguage || storedLanguage || detectedLanguage || 'it';
setLanguage(initialLanguage, false);
if (!storedLanguage || urlLanguage) {
    persistLanguage(initialLanguage);
}

// Theme toggle
const themeButtons = document.querySelectorAll('.theme-toggle-btn');
const FALLBACK_THEME_KEY = 'bagnovega-theme';
const themeController = window.__bagnovegaTheme || null;

function fallbackReadTheme() {
    try {
        const value = localStorage.getItem(FALLBACK_THEME_KEY);
        if (value === 'light' || value === 'dark') return value;
    } catch (error) {
        console.warn('[Theme] localStorage unavailable');
    }
    return null;
}

function fallbackPersistTheme(theme) {
    try {
        localStorage.setItem(FALLBACK_THEME_KEY, theme);
    } catch (error) {
        console.warn('[Theme] localStorage unavailable, unable to persist theme fallback');
    }
}

function fallbackApplyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

const themeAPI = {
    defaultTheme: (themeController && themeController.defaultTheme) || 'dark',
    readTheme: (themeController && themeController.readTheme) || fallbackReadTheme,
    persistTheme: (themeController && themeController.persistTheme) || fallbackPersistTheme,
    applyTheme: (themeController && themeController.applyTheme) || fallbackApplyTheme,
    readThemeFromUrl: (themeController && themeController.readThemeFromUrl) || getThemeFromUrl
};

function syncThemeButtons(theme) {
    themeButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.themeMode === theme);
    });
}

function applyTheme(theme, persist = true) {
    if (!theme) return;
    const normalized = theme === 'light' ? 'light' : 'dark';
    console.log('[Theme] Applying theme:', normalized, 'Persist:', persist);
    themeAPI.applyTheme(normalized);
    currentThemeMode = normalized;
    syncThemeButtons(normalized);
    updateUrlThemeParam(normalized);
    updateStateAwareLinks(getActiveLanguage(), normalized);
    if (persist) {
        themeAPI.persistTheme(normalized);
        console.log('[Theme] Saved theme:', normalized);
    }
}

const urlThemeChoice = themeAPI.readThemeFromUrl ? themeAPI.readThemeFromUrl() : null;
const storedTheme = themeAPI.readTheme();
const currentTheme = urlThemeChoice || storedTheme || themeAPI.defaultTheme;
currentThemeMode = currentTheme;
updateUrlThemeParam(currentTheme);
updateStateAwareLinks(getActiveLanguage(), currentTheme);

console.log('[Theme] Page loaded. UrlTheme:', urlThemeChoice, 'StoredTheme:', storedTheme, 'CurrentTheme:', currentTheme);

if (urlThemeChoice && urlThemeChoice !== storedTheme) {
    themeAPI.persistTheme(urlThemeChoice);
    console.log('[Theme] Synced URL theme to storage:', urlThemeChoice);
} else if (!storedTheme) {
    themeAPI.persistTheme(currentTheme);
    console.log('[Theme] No stored theme, saved default:', currentTheme);
}

syncThemeButtons(currentTheme);
console.log('[Theme] Button states updated for theme:', currentTheme);

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('active')) return;
        applyTheme(button.dataset.themeMode);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== HERO SLIDER ====================
// Single hero image - no slider needed

// ==================== SCROLL REVEAL ANIMATIONS ====================
const isMobile = window.innerWidth <= 768;
const scrollRevealOptions = {
    threshold: isMobile ? 0.1 : 0.15,
    rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
};

const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            scrollRevealObserver.unobserve(entry.target);
        }
    });
}, scrollRevealOptions);

// Elements to animate on scroll
const revealElements = document.querySelectorAll(`
    .hero-full,
    .intro-section,
    .intro-container h2,
    .intro-text,
    .intro-links,
    .grid-image,
    .quote-section,
    .servizio-full-item,
    .pricing-col,
    .feature-item,
    .cta-section,
    .contact-info-section,
    .contact-form-wrapper,
    .page-hero,
    .pricing-image-section,
    .masonry-item,
    .menu-item-full,
    .menu-tags
`);

// Add reveal-hidden class initially and observe
revealElements.forEach(el => {
    el.classList.add('reveal-hidden');
    scrollRevealObserver.observe(el);
});

// Trigger reveal for elements already in viewport on page load
function checkInitialVisibility() {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Check if element is in viewport
        if (rect.top < windowHeight - 50 && rect.bottom > 0) {
            el.classList.add('reveal');
            scrollRevealObserver.unobserve(el);
        }
    });
}

// Run check after a short delay to ensure page is fully loaded
setTimeout(checkInitialVisibility, 100);

// Stagger animation for grid items
const gridItems = document.querySelectorAll('.grid-image');
gridItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

const pricingCols = document.querySelectorAll('.pricing-col');
pricingCols.forEach((col, index) => {
    col.style.transitionDelay = `${index * 0.15}s`;
});

const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

const masonryItems = document.querySelectorAll('.masonry-item');
// Only add transition delay on desktop for better mobile performance
if (!isMobile) {
    masonryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.015}s`;
    });
}

const menuItems = document.querySelectorAll('.menu-item-full');
menuItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
});

// ==================== FORM HANDLING ====================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show success message (in a real app, you'd send this to a server)
        showNotification('Messaggio inviato con successo! Ti contatteremo presto.', 'success');

        // Reset form
        contactForm.reset();
    });
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        backgroundColor: type === 'success' ? '#4caf50' : '#2196F3',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px'
    });

    // Add to body
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .navbar.scroll-down {
        transform: translateY(-100%);
    }

    .navbar.scroll-up {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// ==================== GALLERY MODAL ====================
const galleryItems = document.querySelectorAll('.gallery-item, .spiaggia-image');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-overlay"></div>
            <div class="gallery-modal-content">
                <button class="gallery-modal-close">&times;</button>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;

        // Add styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .gallery-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .gallery-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                cursor: pointer;
            }

            .gallery-modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                z-index: 10000;
                animation: zoomIn 0.3s ease;
            }

            .gallery-modal-content img {
                max-width: 100%;
                max-height: 90vh;
                border-radius: 8px;
            }

            .gallery-modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 40px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease;
            }

            .gallery-modal-close:hover {
                transform: rotate(90deg);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes zoomIn {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;

        // Add modal to body
        document.body.appendChild(modalStyle);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal handlers
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                modalStyle.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        modal.querySelector('.gallery-modal-overlay').addEventListener('click', closeModal);
        modal.querySelector('.gallery-modal-close').addEventListener('click', closeModal);

        // Close on ESC key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
});

// ==================== LAZY LOADING IMAGES ====================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');

    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bagno Vega 101 - Website loaded successfully');

    // Add loading animation class removal
    document.body.classList.add('loaded');
});

// ==================== WEATHER WIDGET ====================
async function loadWeatherWidget() {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;

    try {
        // Using Open-Meteo API (free, no API key required)
        // Coordinates for Cesenatico: 44.2231, 12.3817
        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=44.2231&longitude=12.3817&current=temperature_2m,weather_code&timezone=Europe/Rome'
        );

        if (!response.ok) throw new Error('Weather fetch failed');

        const data = await response.json();
        const temp = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;

        // Weather code to icon mapping
        const weatherIcons = {
            0: '☀️',      // Clear sky
            1: '🌤️',     // Mainly clear
            2: '⛅',     // Partly cloudy
            3: '☁️',     // Overcast
            45: '🌫️',   // Fog
            48: '🌫️',   // Depositing rime fog
            51: '🌦️',   // Light drizzle
            53: '🌦️',   // Moderate drizzle
            55: '🌦️',   // Dense drizzle
            61: '🌧️',   // Slight rain
            63: '🌧️',   // Moderate rain
            65: '🌧️',   // Heavy rain
            71: '🌨️',   // Slight snow
            73: '🌨️',   // Moderate snow
            75: '🌨️',   // Heavy snow
            80: '🌦️',   // Slight rain showers
            81: '🌧️',   // Moderate rain showers
            82: '🌧️',   // Violent rain showers
            95: '⛈️',   // Thunderstorm
            96: '⛈️',   // Thunderstorm with hail
            99: '⛈️'    // Thunderstorm with heavy hail
        };

        const icon = weatherIcons[weatherCode] || '🌤️';

        // Get current day in Italian
        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const today = days[new Date().getDay()];

        // Update widget
        weatherWidget.querySelector('.weather-icon').textContent = icon;
        weatherWidget.querySelector('.weather-temp').textContent = `${temp}°`;
        weatherWidget.querySelector('.weather-day').textContent = today;

    } catch (error) {
        console.log('Using default weather data');
        // Keep default values if API fails
    }
}

// Load weather when page loads
document.addEventListener('DOMContentLoaded', loadWeatherWidget);

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Additional scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ==================== GALLERY LIGHTBOX ====================
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; // Only run on gallery page

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const galleryItems = document.querySelectorAll('.masonry-item img');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const image = images[currentIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Event listeners
    galleryItems.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
});
