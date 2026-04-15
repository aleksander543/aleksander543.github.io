document.addEventListener('DOMContentLoaded', () => {

  // Header scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('burgerBtn');
  const mobile = document.getElementById('mobileMenu');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('active');
      burger.classList.toggle('active');
      document.body.classList.toggle('no-scroll', open);
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobile.classList.remove('active');
      burger.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }));
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const dur = 2000;
        const start = performance.now();
        const fmt = n => n.toLocaleString('pl-PL');
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(target * ease));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        cObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));

  // FAQ accordion
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Contact form
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    if (!fd.get('name') || !fd.get('email') || !fd.get('privacy')) {
      alert('Proszę wypełnić wymagane pola.');
      return;
    }
    alert('Dziękujemy! Twoja wiadomość została wysłana.');
    form.reset();
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Parallax moon on scroll
  const moon = document.querySelector('.hero__moon');
  if (moon) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      moon.style.transform = `translateY(${y * 0.15}px)`;
    }, { passive: true });
  }

  // Cookie consent
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner && !localStorage.getItem('megapolis_cookies')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1500);
    cookieBanner.querySelectorAll('[data-cookie]').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('megapolis_cookies', btn.dataset.cookie);
        cookieBanner.classList.remove('visible');
      });
    });
  }

  // Chatbot toggle
  const chatFab = document.getElementById('chatbotFab');
  const chatWin = document.getElementById('chatbotWindow');
  if (chatFab && chatWin) {
    chatFab.addEventListener('click', () => {
      chatFab.classList.toggle('open');
      chatWin.classList.toggle('open');
    });
    chatWin.querySelectorAll('.chatbot-msg--quick button').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = chatWin.querySelector('.chatbot-window__body');
        const userMsg = document.createElement('div');
        userMsg.className = 'chatbot-msg chatbot-msg--user';
        userMsg.style.cssText = 'align-self:flex-end; background:var(--accent); color:var(--bg); border-radius:var(--radius) var(--radius) 4px var(--radius);';
        userMsg.textContent = btn.textContent;
        body.appendChild(userMsg);
        btn.parentElement.remove();
        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'chatbot-msg chatbot-msg--bot';
          reply.textContent = 'Dziękujemy za wiadomość! Nasz doradca skontaktuje się z Tobą wkrótce. W pilnych sprawach dzwoń: 12 300 00 77.';
          body.appendChild(reply);
          body.scrollTop = body.scrollHeight;
        }, 800);
      });
    });
    const chatInput = chatWin.querySelector('.chatbot-window__input');
    if (chatInput) {
      const inp = chatInput.querySelector('input');
      const sendBtn = chatInput.querySelector('button');
      const sendMsg = () => {
        if (!inp.value.trim()) return;
        const body = chatWin.querySelector('.chatbot-window__body');
        const userMsg = document.createElement('div');
        userMsg.className = 'chatbot-msg chatbot-msg--user';
        userMsg.style.cssText = 'align-self:flex-end; background:var(--accent); color:var(--bg); border-radius:var(--radius) var(--radius) 4px var(--radius);';
        userMsg.textContent = inp.value;
        body.appendChild(userMsg);
        inp.value = '';
        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'chatbot-msg chatbot-msg--bot';
          reply.textContent = 'Dziękujemy za wiadomość! Nasz doradca odpowie najszybciej jak to możliwe.';
          body.appendChild(reply);
          body.scrollTop = body.scrollHeight;
        }, 800);
      };
      sendBtn.addEventListener('click', sendMsg);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
    }
  }

  // Back to top
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Mortgage calculator
  const calcForm = document.getElementById('mortgageCalc');
  if (calcForm) {
    const price = calcForm.querySelector('#calc-price');
    const down = calcForm.querySelector('#calc-down');
    const years = calcForm.querySelector('#calc-years');
    const rate = calcForm.querySelector('#calc-rate');
    const fmt = n => n.toLocaleString('pl-PL');
    const update = () => {
      const P = +price.value - (+price.value * +down.value / 100);
      const r = +rate.value / 100 / 12;
      const n = +years.value * 12;
      const monthly = r > 0 ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : P / n;
      const total = monthly * n;
      const interest = total - P;
      calcForm.querySelector('#calc-price-val').textContent = fmt(+price.value) + ' zł';
      calcForm.querySelector('#calc-down-val').textContent = down.value + '% (' + fmt(Math.round(+price.value * +down.value / 100)) + ' zł)';
      calcForm.querySelector('#calc-years-val').textContent = years.value + ' lat';
      calcForm.querySelector('#calc-rate-val').textContent = rate.value + '%';
      calcForm.querySelector('#calc-monthly').textContent = fmt(Math.round(monthly)) + ' zł';
      calcForm.querySelector('#calc-total').textContent = fmt(Math.round(total)) + ' zł';
      calcForm.querySelector('#calc-interest').textContent = fmt(Math.round(interest)) + ' zł';
      calcForm.querySelector('#calc-loan').textContent = fmt(Math.round(P)) + ' zł';
    };
    [price, down, years, rate].forEach(el => el.addEventListener('input', update));
    update();
  }

  // Newsletter form
  const nlForm = document.getElementById('newsletterForm');
  nlForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = nlForm.querySelector('input[type="email"]').value;
    if (!email) return;
    nlForm.innerHTML = '<p style="color:var(--accent); font-size:16px; font-weight:500;">Dziękujemy za zapis! ✓</p>';
  });

});
