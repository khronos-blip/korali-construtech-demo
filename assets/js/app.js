(() => {
  'use strict';

  const profileUrl = 'https://www.instagram.com/construtech_anibaladdesse/';
  const projects = {
    gate: {
      kicker: 'Trabajo / Metal', title: 'Portón metálico',
      description: 'Portón metálico corredizo mostrado por CONSTRUTECH en su perfil oficial.',
      image: 'assets/images/project-10.jpg', alt: 'Portón metálico corredizo con estructura vertical',
      source: 'https://www.instagram.com/construtech_anibaladdesse/p/DZFgsi_lnTl/'
    },
    operators: {
      kicker: 'Solución / Accesos', title: 'Operadores eléctricos',
      description: 'Contenido oficial sobre operadores eléctricos para accesos residenciales, comerciales y portones.',
      image: 'assets/images/project-04.jpg', alt: 'Portada informativa sobre operadores eléctricos para portones',
      source: 'https://www.instagram.com/construtech_anibaladdesse/reel/Dbk6W_htzuY/'
    },
    controls: {
      kicker: 'Componentes / Control', title: 'Controles remotos',
      description: 'Selección visual de controles remotos presentada por CONSTRUTECH.',
      image: 'assets/images/project-06.jpg', alt: 'Controles remotos para automatización de accesos',
      source: 'https://www.instagram.com/construtech_anibaladdesse/reel/DaiLAjCNOXc/'
    },
    motors: {
      kicker: 'Solución / Movimiento', title: 'Motores y accesorios',
      description: 'Contenido oficial dedicado a motores, accesorios y controles para automatización.',
      image: 'assets/images/project-07.jpg', alt: 'Portada informativa sobre motores, accesorios y controles',
      source: 'https://www.instagram.com/construtech_anibaladdesse/reel/DaiK6aHNUD3/'
    }
  };

  const lockBody = () => document.body.classList.add('is-locked');
  const unlockBody = () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
  };

  const header = document.querySelector('[data-header]');
  const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 110);
  window.addEventListener('scroll', setHeader, { passive: true });
  setHeader();

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    nav.classList.toggle('is-open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  const projectDialog = document.querySelector('[data-project-dialog]');
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    const image = projectDialog.querySelector('[data-dialog-image]');
    image.src = project.image;
    image.alt = project.alt;
    projectDialog.querySelector('[data-dialog-kicker]').textContent = project.kicker;
    projectDialog.querySelector('[data-dialog-title]').textContent = project.title;
    projectDialog.querySelector('[data-dialog-description]').textContent = project.description;
    projectDialog.querySelector('[data-dialog-source]').href = project.source;
    projectDialog.showModal();
    lockBody();
  }));
  projectDialog.querySelector('[data-close-dialog]').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => {
    if (event.target === projectDialog) projectDialog.close();
  });
  projectDialog.addEventListener('close', unlockBody);

  const quoteDialog = document.querySelector('[data-quote-dialog]');
  const form = document.querySelector('[data-quote-form]');
  const steps = [...form.querySelectorAll('[data-step]')];
  const progress = form.querySelector('[data-progress-bar]');
  let currentStep = 1;

  const showStep = step => {
    currentStep = step;
    steps.forEach(panel => panel.classList.toggle('is-active', Number(panel.dataset.step) === step));
    progress.style.width = `${step * 33.333}%`;
    const focusTarget = steps[step - 1].querySelector('input, textarea, a, button');
    if (focusTarget) window.setTimeout(() => focusTarget.focus(), 80);
  };

  document.querySelectorAll('[data-open-quote]').forEach(button => button.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('[data-error]').forEach(error => error.textContent = '');
    form.querySelector('[data-count]').textContent = '0';
    showStep(1);
    quoteDialog.showModal();
    lockBody();
  }));
  quoteDialog.querySelector('[data-close-quote]').addEventListener('click', () => quoteDialog.close());
  quoteDialog.addEventListener('click', event => {
    if (event.target === quoteDialog) quoteDialog.close();
  });
  quoteDialog.addEventListener('close', unlockBody);

  form.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {
    const panel = steps[currentStep - 1];
    const error = panel.querySelector('[data-error]');
    if (currentStep === 1 && !form.elements.service.value) {
      error.textContent = 'Selecciona una opción para continuar.';
      return;
    }
    if (currentStep === 2 && !form.elements.note.value.trim()) {
      error.textContent = 'Describe brevemente el trabajo para continuar.';
      form.elements.note.focus();
      return;
    }
    if (error) error.textContent = '';
    if (currentStep === 2) {
      form.querySelector('[data-review-service]').textContent = form.elements.service.value;
      form.querySelector('[data-review-note]').textContent = form.elements.note.value.trim();
    }
    showStep(Math.min(3, currentStep + 1));
  }));
  form.querySelectorAll('[data-prev]').forEach(button => button.addEventListener('click', () => showStep(Math.max(1, currentStep - 1))));
  form.elements.note.addEventListener('input', event => {
    form.querySelector('[data-count]').textContent = String(event.target.value.length);
  });
  form.addEventListener('submit', event => event.preventDefault());

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') unlockBody();
  });

  document.querySelectorAll(`a[href="${profileUrl}"]`).forEach(link => link.setAttribute('data-official-contact', 'true'));
})();
