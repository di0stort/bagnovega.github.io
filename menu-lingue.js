// Menu Lingue - Language Selector
document.addEventListener('DOMContentLoaded', function() {
    const languageButtons = document.querySelectorAll('.language-flag-btn');
    const menuContents = document.querySelectorAll('.menu-language-content');

    // Get current site language from localStorage or default to 'it'
    const currentSiteLang = localStorage.getItem('selectedLanguage') || 'it';

    // Set initial active language based on site language
    function setInitialLanguage() {
        // Only activate Italian or English based on site language
        const initialLang = (currentSiteLang === 'en') ? 'en' : 'it';

        languageButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-language');
            if (btnLang === initialLang) {
                btn.classList.add('active');
                const correspondingContent = document.getElementById('menu-' + btnLang);
                if (correspondingContent) {
                    correspondingContent.classList.add('active');
                }
            } else {
                btn.classList.remove('active');
                const correspondingContent = document.getElementById('menu-' + btnLang);
                if (correspondingContent) {
                    correspondingContent.classList.remove('active');
                }
            }
        });
    }

    // Initialize on page load
    setInitialLanguage();

    // Handle language button clicks
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-language');

            // Remove active class from all buttons and contents
            languageButtons.forEach(btn => btn.classList.remove('active'));
            menuContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const selectedContent = document.getElementById('menu-' + selectedLang);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
        });
    });
});
