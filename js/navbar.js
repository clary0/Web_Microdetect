document.addEventListener('DOMContentLoaded', async () => {
    const placeholders = document.querySelectorAll('[data-navbar]');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    await Promise.all(Array.from(placeholders, async (placeholder) => {
        try {
            const response = await fetch('componentes/navbar.html', { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error(`Navbar request failed: ${response.status}`);
            }

            placeholder.innerHTML = await response.text();
            const currentLink = Array.from(placeholder.querySelectorAll('.nav-menu a'))
                .find((link) => new URL(link.href).pathname.split('/').pop() === currentPage);

            currentLink?.setAttribute('aria-current', 'page');

            const toggle = placeholder.querySelector('.nav-toggle');
            const menu = placeholder.querySelector('.nav-menu');

            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                toggle.setAttribute('aria-label', isExpanded ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
                menu.classList.toggle('is-open', !isExpanded);
            });

            menu.addEventListener('click', (event) => {
                if (event.target.closest('a')) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
                    menu.classList.remove('is-open');
                }
            });
        } catch (error) {
            console.error('No se pudo cargar la barra de navegación.', error);
        }
    }));
});