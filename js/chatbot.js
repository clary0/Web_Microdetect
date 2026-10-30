document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('componentes/chatbot.html', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Chatbot request failed: ${response.status}`);
        }

        const template = document.createElement('template');
        template.innerHTML = await response.text();
        const chatbot = template.content.firstElementChild;
        document.body.append(chatbot);

        const launcher = chatbot.querySelector('.chat-launcher');
        const panel = chatbot.querySelector('.chat-panel');
        const closeButton = chatbot.querySelector('.chat-close');
        const form = chatbot.querySelector('.chat-form');
        const input = form.querySelector('input');
        const messages = chatbot.querySelector('.chat-messages');

        function setOpen(isOpen) {
            panel.hidden = !isOpen;
            launcher.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) {
                input.focus();
            } else {
                launcher.focus();
            }
        }

        function addMessage(text, role, link) {
            const message = document.createElement('div');
            message.className = `chat-message chat-message-${role}`;
            message.textContent = text;

            if (link) {
                const anchor = document.createElement('a');
                anchor.className = 'chat-message-link';
                anchor.href = link.href;
                anchor.textContent = link.label;
                message.append(document.createElement('br'), anchor);
            }

            messages.append(message);
            messages.scrollTop = messages.scrollHeight;
        }

        function getAnswer(question) {
            const normalized = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

            if (/ufc|dilucion|unidades formadoras/.test(normalized)) {
                return {
                    text: 'UFC/mL significa unidades formadoras de colonias por mililitro. Microdetect presenta el cálculo a partir del conteo, la dilución y el volumen sembrado.',
                    link: { href: 'servicios.html', label: 'Ver servicios' }
                };
            }

            if (/registro|crear cuenta|registrarme|iniciar sesion|login|contrasena|acceso/.test(normalized)) {
                return {
                    text: 'Este sitio ya no ofrece registro ni inicio de sesión. Para consultar el acceso a la aplicación Microdetect, contáctanos.',
                    link: { href: 'contactanos.html', label: 'Consultar acceso a la app' }
                };
            }

            if (/quienes somos|que es microdetect|microdetect|sobre nosotros/.test(normalized)) {
                return {
                    text: 'Microdetect es una aplicación de apoyo al análisis de fotografías de placas Petri, el conteo de colonias y la organización de resultados microbiológicos.',
                    link: { href: 'quienes-somos.html', label: 'Conocer quiénes somos' }
                };
            }

            if (/contacto|hablar|soporte|persona|ayuda/.test(normalized)) {
                return {
                    text: 'Puedes enviarnos un mensaje desde la página de contacto.',
                    link: { href: 'contactanos.html', label: 'Ir a Contacto' }
                };
            }

            if (/descargar|descarga|app|aplicacion/.test(normalized)) {
                return {
                    text: 'La descarga para Android aparecerá aquí cuando esté listo el instalador de Microdetect.',
                    link: { href: 'descargar.html', label: 'Ver descarga para Android' }
                };
            }

            if (/historial|reporte|pdf|guardar/.test(normalized)) {
                return {
                    text: 'La sección de servicios describe el historial de muestras y la generación de reportes en PDF.',
                    link: { href: 'servicios.html', label: 'Ver servicios' }
                };
            }

            if (/servicio|que hace|microdetect|analisis|muestra|foto|placa|colonia|empezar/.test(normalized)) {
                return {
                    text: 'Microdetect está pensado para analizar fotografías de placas Petri, apoyar el conteo de colonias y organizar resultados microbiológicos.',
                    link: { href: 'servicios.html', label: 'Conocer servicios' }
                };
            }

            return {
                text: 'Puedo ayudarte con Microdetect, servicios, UFC/mL, acceso a la app o contacto. ¿Sobre cuál tema quieres saber?',
                link: { href: 'servicios.html', label: 'Explorar servicios' }
            };
        }

        function sendMessage(text) {
            const question = text.trim();
            if (!question) {
                return;
            }

            addMessage(question, 'user');
            const answer = getAnswer(question);
            addMessage(answer.text, 'bot', answer.link);
        }

        launcher.addEventListener('click', () => setOpen(panel.hidden));
        closeButton.addEventListener('click', () => setOpen(false));
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            sendMessage(input.value);
            input.value = '';
            input.focus();
        });

        chatbot.querySelectorAll('[data-chat-prompt]').forEach((button) => {
            button.addEventListener('click', () => sendMessage(button.dataset.chatPrompt));
        });

        chatbot.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !panel.hidden) {
                setOpen(false);
            }
        });
    } catch (error) {
        console.error('No se pudo cargar el asistente de Microdetect.', error);
    }
});