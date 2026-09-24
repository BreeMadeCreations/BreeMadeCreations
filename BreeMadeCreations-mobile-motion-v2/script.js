const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const clamp = (min,v,max) => Math.max(min,Math.min(max,v));
const lerp = (a,b,t) => a+(b-a)*t;

const menuBtn = $('.menu-btn');
const nav = $('.nav');
if(menuBtn && nav){
  menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}));
}
$('#year').textContent = new Date().getFullYear();

const lightbox = $('#lightbox');
const lightboxImg = lightbox?.querySelector('img');
const closeBtn = lightbox?.querySelector('.lightbox-close');
$$('[data-image]').forEach(el=>el.addEventListener('click',()=>{
  if(!lightbox || !lightboxImg) return;
  lightboxImg.src = el.dataset.image;
  lightboxImg.alt = el.querySelector('img')?.alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-open');
}));
function closeBox(){if(!lightbox||!lightboxImg)return;lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');lightboxImg.src='';}
closeBtn?.addEventListener('click',closeBox);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeBox();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox();});

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced){
  let raf=false;
  const progress = $('.scroll-progress span');
  const ticker = $('.ticker-track');
  const hero = $('.hero');
  const heroCopy = $('.hero-copy');
  const heroCollage = $('.hero-collage');
  const heroLogo = $('.hero-logo');
  const heroPhotos = $$('.hero-photo');
  const stars = $$('.ambient-star');
  const banner = $('.brand-banner img');
  const story = $('.story');
  const storyCopy = $('.story-copy');
  const storyCards = $$('.story-card');
  const storyCount = $('.story-count span');
  const storyWord = $('.story-word');
  const make = $('.make-scroll');
  const makeTrack = $('.make-track');
  const makeWindow = $('.make-window');
  const makeCount = $('.make-count span');
  const makeWord = $('.make-word');

  const setStoryCard=(el,x,y,r,s,z,o,clip)=>{
    if(!el)return;
    el.style.setProperty('--x',`${x.toFixed(1)}px`);el.style.setProperty('--y',`${y.toFixed(1)}px`);el.style.setProperty('--r',`${r.toFixed(2)}deg`);el.style.setProperty('--s',s.toFixed(3));el.style.setProperty('--z',`${z.toFixed(1)}px`);el.style.setProperty('--o',o.toFixed(3));el.style.setProperty('--clip',`${clip.toFixed(1)}%`);
  };

  const update=()=>{
    const y=scrollY||0, vh=innerHeight||800;
    const pageMax=Math.max(1,document.documentElement.scrollHeight-vh);
    if(progress)progress.style.transform=`scaleX(${clamp(0,y/pageMax,1)})`;
    if(ticker)ticker.style.transform=`translate3d(${(-((y*.31)%780)).toFixed(1)}px,0,0)`;

    stars.forEach((el,i)=>{const speeds=[.018,.032,.011,.026,.015,.022];el.style.transform=`translate3d(0,${(y*speeds[i]).toFixed(1)}px,0) rotate(${(y*speeds[i]*.08).toFixed(2)}deg)`;});

    if(hero){
      const p=clamp(0,y/(vh*.9),1);
      heroCopy.style.transform=`translate3d(0,${lerp(0,-90,p).toFixed(1)}px,0)`;heroCopy.style.opacity=lerp(1,.42,p).toFixed(3);
      heroCollage.style.transform=`translate3d(0,${lerp(0,90,p).toFixed(1)}px,0) scale(${lerp(1,.88,p).toFixed(3)})`;
      heroLogo.style.transform=`rotate(${lerp(0,-3,p).toFixed(2)}deg) scale(${lerp(1,.94,p).toFixed(3)})`;
      const vectors=[[-28,-54,-5],[28,-30,5],[-20,44,-4],[24,36,4]];
      heroPhotos.forEach((el,i)=>{const [dx,dy,dr]=vectors[i]||[0,0,0];el.style.translate=`${(dx*p).toFixed(1)}px ${(dy*p).toFixed(1)}px`;el.style.rotate=`${(dr*p).toFixed(2)}deg`;});
    }

    if(banner){const r=banner.getBoundingClientRect();const p=clamp(0,1-Math.abs((r.top+r.height/2)-vh/2)/(vh*.85),1);banner.style.transform=`translate3d(0,${lerp(38,0,p).toFixed(1)}px,0) scale(${lerp(.93,1,p).toFixed(3)}) rotateX(${lerp(4,0,p).toFixed(2)}deg)`;banner.style.clipPath=`inset(${lerp(8,0,p).toFixed(2)}% round 30px)`;}

    if(story && innerWidth > 1100){
      const r=story.getBoundingClientRect();const avail=Math.max(1,story.offsetHeight-vh);const p=clamp(0,-r.top/avail,1);const e=p*p*(3-2*p);
      storyCopy.style.transform=`translate3d(0,${lerp(28,-46,e).toFixed(1)}px,0)`;storyCopy.style.opacity=lerp(.88,1,Math.min(1,p*2)).toFixed(3);
      if(storyWord)storyWord.style.transform=`translate3d(${lerp(100,-560,e).toFixed(1)}px,0,0)`;
      if(storyCount)storyCount.textContent=String(Math.min(4,Math.max(1,Math.floor(p*4)+1))).padStart(2,'0');
      setStoryCard(storyCards[0],lerp(0,-215,e),lerp(0,-105,e),lerp(0,-10,e),lerp(1.05,.94,e),lerp(100,0,e),1,lerp(6,0,e));
      setStoryCard(storyCards[1],lerp(12,195,e),lerp(12,-120,e),lerp(2,11,e),lerp(.99,.88,e),lerp(58,-20,e),lerp(.91,1,e),lerp(9,0,e));
      setStoryCard(storyCards[2],lerp(-7,-150,e),lerp(18,188,e),lerp(-2,-8,e),lerp(.96,.83,e),lerp(32,-36,e),lerp(.82,1,e),lerp(12,0,e));
      setStoryCard(storyCards[3],lerp(20,205,e),lerp(24,176,e),lerp(3,9,e),lerp(.93,.80,e),lerp(10,-52,e),lerp(.70,1,e),lerp(15,0,e));
    }

    $$('.kinetic').forEach(div=>{const r=div.getBoundingClientRect();const p=clamp(-1,(r.top-vh*.5)/vh,1);$('.kinetic-a',div).style.transform=`translate3d(${(p*-180).toFixed(1)}px,0,0)`;$('.kinetic-b',div).style.transform=`translate3d(${(p*210).toFixed(1)}px,0,0)`;});

    if(make && makeTrack && makeWindow && innerWidth > 1100){
      const r=make.getBoundingClientRect(),avail=Math.max(1,make.offsetHeight-vh),p=clamp(0,-r.top/avail,1);const maxX=Math.max(0,makeTrack.scrollWidth-makeWindow.clientWidth+100);makeTrack.style.transform=`translate3d(${(-maxX*p).toFixed(1)}px,0,0)`;if(makeWord)makeWord.style.transform=`translate3d(${lerp(80,-620,p).toFixed(1)}px,0,0)`;if(makeCount)makeCount.textContent=String(Math.min(6,Math.max(1,Math.floor(p*6)+1))).padStart(2,'0');$$('.make-card').forEach((card,i)=>{const local=clamp(0,1-Math.abs((i/5)-p)*1.8,1);card.style.setProperty('--card-s',(0.92+local*.08).toFixed(3));card.style.setProperty('--card-r',`${((i%2?1:-1)*(1-local)*2.6).toFixed(2)}deg`);});
    }

    $$('.gallery-card').forEach((card,i)=>{const r=card.getBoundingClientRect();const n=clamp(-1,(r.top+r.height/2-vh/2)/vh,1);const proximity=1-Math.abs(n);card.style.setProperty('--gy',`${(n*(12+(i%5)*5)).toFixed(1)}px`);card.style.setProperty('--gr',`${(n*((i%2?1:-1)*.6)).toFixed(2)}deg`);card.style.setProperty('--gs',(1+proximity*.013).toFixed(3));card.style.setProperty('--gclip',`${(9-proximity*9).toFixed(2)}%`);});

    $$('.info-image').forEach((el,i)=>{const r=el.getBoundingClientRect();const p=clamp(0,1-Math.abs((r.top+r.height/2)-vh/2)/(vh*.9),1);el.style.transform=`translate3d(0,${((1-p)*(i%2?28:-28)).toFixed(1)}px,0) scale(${(.965+p*.035).toFixed(3)})`;el.style.clipPath=`inset(${((1-p)*9).toFixed(2)}% round 28px)`;});

    $$('.policy-card').forEach((el,i)=>{const r=el.getBoundingClientRect();const n=clamp(-1,(r.top+r.height/2-vh/2)/vh,1);el.style.setProperty('--py',`${(n*(i===1?18:28)).toFixed(1)}px`);el.style.setProperty('--pr',`${(n*(i===1?-.4:(i? .8:-.8))).toFixed(2)}deg`);});

    raf=false;
  };
  const request=()=>{if(!raf){requestAnimationFrame(update);raf=true;}};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});request();
}


// Image reliability: if a browser fails to load a cached/encoded image, retry the exact asset path once.
$$('img').forEach(img => {
  img.addEventListener('error', () => {
    if (img.dataset.retried === '1') return;
    img.dataset.retried = '1';
    const raw = img.getAttribute('src') || '';
    const clean = raw.split('?')[0];
    if (clean && clean !== raw) img.src = clean;
  });
});

// Mobile/tablet scroll motion: keep the safe responsive layout, but make it feel alive.
if (!reduced) {
  let mobileRaf = false;

  const mobileMotion = () => {
    const vw = window.innerWidth || 390;
    if (vw > 1100) { mobileRaf = false; return; }

    const vh = window.innerHeight || 800;
    const y = window.scrollY || 0;

    const viewportProgress = el => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      return clamp(-1, (center - vh / 2) / (vh * .78), 1);
    };

    // Story cards rise, tilt, and open as they pass through the center of the screen.
    $$('.story-card').forEach((card, i) => {
      const n = viewportProgress(card);
      const near = 1 - Math.abs(n);
      const dir = i % 2 ? 1 : -1;
      card.style.setProperty('--m-story-y', `${(n * (18 + i * 2)).toFixed(1)}px`);
      card.style.setProperty('--m-story-r', `${(n * dir * 2.2).toFixed(2)}deg`);
      card.style.setProperty('--m-story-s', (0.955 + near * .045).toFixed(3));
      card.style.setProperty('--m-story-o', (0.74 + near * .26).toFixed(3));
      card.style.setProperty('--m-story-clip', `${((1-near)*7).toFixed(2)}%`);
    });

    const story = $('.story');
    if (story) {
      const r = story.getBoundingClientRect();
      const p = clamp(0, 1 - Math.abs((r.top + r.height/2) - vh/2) / (vh*1.35), 1);
      story.style.setProperty('--m-story-bg-x', `${lerp(55,-55,p).toFixed(1)}px`);
    }

    // What-I-Make cards behave like a moving deck while the page scrolls vertically.
    $$('.make-card').forEach((card, i) => {
      const n = viewportProgress(card);
      const near = 1 - Math.abs(n);
      const dir = i % 2 ? -1 : 1;
      card.style.setProperty('--m-make-y', `${(n * (11 + (i%3)*3)).toFixed(1)}px`);
      card.style.setProperty('--m-make-r', `${(n * dir * 1.7).toFixed(2)}deg`);
      card.style.setProperty('--m-make-s', (0.965 + near * .035).toFixed(3));
      card.style.setProperty('--m-make-o', (0.78 + near * .22).toFixed(3));
    });
    const makeSection = $('.make-scroll');
    if (makeSection) {
      const r = makeSection.getBoundingClientRect();
      const n = clamp(-1,(r.top + r.height/2 - vh/2)/vh,1);
      makeSection.style.setProperty('--m-make-bg-x', `${(n * -90).toFixed(1)}px`);
    }

    // Gallery gets the most noticeable movement, but never leaves its grid cell.
    $$('.gallery-card').forEach((card, i) => {
      const n = viewportProgress(card);
      const near = 1 - Math.abs(n);
      const dir = i % 2 ? 1 : -1;
      card.style.setProperty('--m-gallery-y', `${(n * (9 + (i%4)*4)).toFixed(1)}px`);
      card.style.setProperty('--m-gallery-r', `${(n * dir * 1.45).toFixed(2)}deg`);
      card.style.setProperty('--m-gallery-s', (0.975 + near * .025).toFixed(3));
      card.style.setProperty('--m-gallery-o', (0.76 + near * .24).toFixed(3));
      card.style.setProperty('--m-gallery-clip', `${((1-near)*5.5).toFixed(2)}%`);
    });
    const gallery = $('.gallery-section');
    if (gallery) gallery.style.setProperty('--m-gallery-star-r', `${(y*.035).toFixed(1)}deg`);

    // Copy blocks drift a touch slower than the page for depth.
    $$('.story-copy, .make-head, .section-head, .support-copy, .contact-section > div').forEach((el, i) => {
      const n = viewportProgress(el);
      const near = 1 - Math.abs(n);
      el.style.setProperty('--m-copy-y', `${(n * (8 + (i%2)*3)).toFixed(1)}px`);
      el.style.setProperty('--m-copy-o', (0.82 + near * .18).toFixed(3));
    });

    // Quick links and cards get very small depth movement, not enough to collide.
    $$('.quick-links a, .policy-card, .support-card, .contact-section').forEach((el, i) => {
      const n = viewportProgress(el);
      const drift = n * (4 + (i%3)*2);
      el.style.translate = `0 ${drift.toFixed(1)}px`;
    });

    mobileRaf = false;
  };

  const requestMobileMotion = () => {
    if (!mobileRaf) {
      requestAnimationFrame(mobileMotion);
      mobileRaf = true;
    }
  };

  window.addEventListener('scroll', requestMobileMotion, { passive: true });
  window.addEventListener('resize', requestMobileMotion, { passive: true });
  requestMobileMotion();
}
