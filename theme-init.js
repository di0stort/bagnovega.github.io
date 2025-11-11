// Apply theme ASAP to prevent flashes and persist between pages/protocols
(function() {
    const THEME_STORAGE_KEY = 'bagnovega-theme';
    const WINDOW_NAME_KEY = '__bagnovega_theme';
    const THEME_QUERY_PARAM = 'theme';
    const defaultTheme = 'dark';
    const isFileProtocol = window.location.protocol === 'file:';

    function sanitizeTheme(theme) {
        if (theme === 'light' || theme === 'dark') return theme;
        return null;
    }

    function getDirectoryPath() {
        if (!isFileProtocol) return '/';
        const pathname = window.location.pathname || '/';
        const lastSlash = pathname.lastIndexOf('/');
        if (lastSlash === -1) return '/';
        return pathname.slice(0, lastSlash + 1) || '/';
    }

    function readThemeFromUrl() {
        try {
            const params = new URLSearchParams(window.location.search);
            return sanitizeTheme(params.get(THEME_QUERY_PARAM));
        } catch (error) {
            return null;
        }
    }

    function readLocalStorage() {
        try {
            return sanitizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
        } catch (error) {
            console.warn('[Theme] localStorage unavailable');
            return null;
        }
    }

    function writeLocalStorage(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
            return true;
        } catch (error) {
            console.warn('[Theme] localStorage unavailable, using fallbacks');
            return false;
        }
    }

    function readCookie() {
        const match = document.cookie.match(new RegExp(`${THEME_STORAGE_KEY}=([^;]+)`));
        return match ? sanitizeTheme(decodeURIComponent(match[1])) : null;
    }

    function writeCookie(theme) {
        const parts = [
            `${THEME_STORAGE_KEY}=${encodeURIComponent(theme)}`,
            `path=${getDirectoryPath()}`,
            'max-age=31536000',
            'SameSite=Lax'
        ];
        if (window.location.protocol === 'https:') {
            parts.push('Secure');
        }
        document.cookie = parts.join(';');
    }

    function readWindowName() {
        if (!isFileProtocol || !window.name) return null;
        const match = window.name.match(new RegExp(`${WINDOW_NAME_KEY}=([^;]+)`));
        return match ? sanitizeTheme(decodeURIComponent(match[1])) : null;
    }

    function writeWindowName(theme) {
        if (!isFileProtocol) return;
        const segments = window.name
            ? window.name.split(';').filter(segment => segment && !segment.startsWith(`${WINDOW_NAME_KEY}=`))
            : [];
        segments.push(`${WINDOW_NAME_KEY}=${encodeURIComponent(theme)}`);
        window.name = segments.join(';');
    }

    function readTheme() {
        return readLocalStorage() || readCookie() || readWindowName();
    }

    function persistTheme(theme) {
        const normalized = sanitizeTheme(theme) || defaultTheme;
        writeLocalStorage(normalized);
        writeCookie(normalized);
        writeWindowName(normalized);
        return normalized;
    }

    function applyTheme(theme) {
        const normalized = sanitizeTheme(theme) || defaultTheme;
        document.documentElement.setAttribute('data-theme', normalized);
        return normalized;
    }

    const urlTheme = readThemeFromUrl();
    const storedTheme = readTheme();
    const themeToApply = urlTheme || storedTheme || defaultTheme;

    applyTheme(themeToApply);
    if (urlTheme && urlTheme !== storedTheme) {
        persistTheme(urlTheme);
    } else if (!storedTheme) {
        persistTheme(themeToApply);
    }

    window.__bagnovegaTheme = {
        key: THEME_STORAGE_KEY,
        defaultTheme,
        readTheme,
        persistTheme,
        applyTheme,
        readThemeFromUrl
    };

    console.log('[Theme Inline] Stored:', storedTheme || null, 'UrlTheme:', urlTheme || null, 'Applying:', themeToApply);
})();
