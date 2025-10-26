// script.js — исправленная и стабильная версия
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- HELPERS ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------- PRELOADER ---------- */
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    if(preloader){
      preloader.classList.add('hide');
      setTimeout(()=> preloader.remove(), 500);
    }
  });

  /* ---------- PROGRESS BAR ---------- */
  const progress = $('#progress-bar');
  const updateProgress = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if(progress) progress.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- BURGER / NAV ---------- */
  const burger = $('#burger');
  const nav = $('#main-nav');
  if(burger && nav){
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('show');
      document.body.style.overflow = nav.classList.contains('show') ? 'hidden' : '';
      burger.setAttribute('aria-expanded', String(nav.classList.contains('show')));
    });

    // close nav on link click and smooth scroll
    nav.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.getAttribute('href');
        const target = id ? document.querySelector(id) : null;
        if(target) target.scrollIntoView({ behavior: 'smooth' });
        nav.classList.remove('show');
        burger.classList.remove('open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- TYPEWRITER ---------- */
  const typeEl = $('#typewriter');
  if(typeEl){
    const txt = "Путешествуй. Открывай. Вдохновляйся.";
    let i = 0;
    const tick = () => {
      if(i <= txt.length) {
        typeEl.textContent = txt.slice(0, i++);
        setTimeout(tick, 42);
      }
    };
    setTimeout(tick, 300);
  }

  /* ---------- REVEAL ON SCROLL (IntersectionObserver) ---------- */
  const reveals = $$('.reveal');
  if(reveals.length){
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(ent => {
        if(ent.isIntersecting){
          ent.target.classList.add('visible');
          observer.unobserve(ent.target);
        }
      });
    }, { threshold: 0.18 });
    reveals.forEach(r => io.observe(r));
  }

  /* ---------- RIPPLE EFFECT ---------- */
  $$('.ripple').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple-ef';
      const size = Math.max(rect.width, rect.height) * 1.2;
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size/2}px`;
      span.style.top = `${e.clientY - rect.top - size/2}px`;
      btn.appendChild(span);
      setTimeout(()=> span.remove(), 650);
    });
  });

  /* ---------- TILT (simple) ---------- */
  $$('.tilt').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(-y*8)}deg) rotateY(${x*10}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ---------- PHOTO CAROUSEL (track scroll) ---------- */
  (function initCarousel(){
    const track = $('.carousel-track');
    if(!track) return;
    const items = Array.from(track.children);
    const prev = $('.photo-carousel .prev');
    const next = $('.photo-carousel .next');
    let idx = 0;

    const scrollTo = (i) => {
      const item = items[i];
      if(!item) return;
      track.scrollTo({ left: item.offsetLeft - 12, behavior: 'smooth' });
      idx = i;
    };

    next?.addEventListener('click', () => scrollTo( (idx+1) % items.length ));
    prev?.addEventListener('click', () => scrollTo( (idx-1+items.length) % items.length ));

    // auto
    let auto = setInterval(()=> scrollTo((idx+1) % items.length), 4200);
    track.addEventListener('mouseenter', ()=> clearInterval(auto));
    track.addEventListener('mouseleave', ()=> auto = setInterval(()=> scrollTo((idx+1) % items.length), 4200));
  })();

  /* ---------- TESTIMONIALS CAROUSEL ---------- */
  (function testimonials(){
    const items = $$('.testimonial');
    if(!items.length) return;
    let i = 0;
    const show = (n) => {
      items.forEach(it => it.classList.remove('active'));
      items[n].classList.add('active');
    };
    $('#testPrev')?.addEventListener('click', ()=> { i = (i-1+items.length)%items.length; show(i); });
    $('#testNext')?.addEventListener('click', ()=> { i = (i+1)%items.length; show(i); });
    setInterval(()=> { i=(i+1)%items.length; show(i); }, 6000);
  })();

  /* ---------- COUNTERS ---------- */
  (function counters(){
    const els = $$('.counter');
    if(!els.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          const target = +el.dataset.target;
          let cur = 0;
          const step = Math.max(1, Math.floor(target/120));
          const run = () => {
            cur += step;
            el.textContent = cur >= target ? target : cur;
            if(cur < target) requestAnimationFrame(run);
          };
          run();
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(e => io.observe(e));
  })();

  /* ---------- ACCORDION ---------- */
  $$('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const open = content.style.maxHeight && content.style.maxHeight !== '0px';
      // close all
      $$('.accordion .accordion-content').forEach(c => c.style.maxHeight = null);
      if(!open){
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  /* ---------- MODAL (tour details) ---------- */
  const modal = $('#modal');
  const modalContent = $('#modalContent');
  const closeModalBtn = $('#closeModal');
  $$('.tour-card [data-open-tour]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.dataset.openTour || 'tour';
      const html = `<h3>Детали тура — ${slug}</h3>
        <p>Краткое описание, включено: перелёт, проживание, трансферы, питание (завтрак).</p>
        <p><strong>Рекомендации:</strong> возьмите удобную обувь и легкую куртку.</p>
        <div style="margin-top:14px;"><button class="btn" id="modalCloseInner">Закрыть</button></div>`;
      if(modal && modalContent){
        modalContent.innerHTML = html;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        // close inner
        $('#modalCloseInner')?.addEventListener('click', () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden','true');
          document.body.style.overflow = '';
        });
      }
    });
  });
  closeModalBtn?.addEventListener('click', () => {
    if(modal){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
  });
  modal?.addEventListener('click', (e) => { if(e.target === modal){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ if(modal){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; } } });

  /* ---------- CONTACT FORM (shake + basic) ---------- */
  const form = $('#contactForm');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = Array.from(form.querySelectorAll('input, textarea'));
      const empty = inputs.some(inp => !inp.value.trim());
      if(empty){
        form.classList.add('shake');
        setTimeout(()=> form.classList.remove('shake'), 600);
        return;
      }
      alert('Спасибо! Ваше сообщение отправлено.');
      form.reset();
    });
  }

  /* ---------- minor: smooth scroll buttons ---------- */
  $$('.scroll-btn').forEach(b => {
    b.addEventListener('click', (ev) => {
      const selector = b.dataset.target;
      const target = selector ? $(selector) : null;
      if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- accessibility fallback: remove no-scroll if left hidden ---------- */
  window.addEventListener('focus', () => { if(getComputedStyle(document.body).overflow === 'hidden' && !$('#main-nav')?.classList.contains('show')) document.body.style.overflow = ''; });

});
