/* ============================================================
   KANAK SHRI JEWELLERS — app.js
   Products load LIVE from Firestore.
   Admin adds/edits/deletes → website updates automatically.
   ============================================================ */

'use strict';

/* ── Firebase imports (ES module via CDN) ── */
import { initializeApp }    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ── Init Firebase ── */
const fbApp = initializeApp(firebaseConfig);   // firebaseConfig is defined in data.js
const db    = getFirestore(fbApp);

/* ── Utility ── */
const $  = id  => document.getElementById(id);
const fp = n   => '₹' + Number(n).toLocaleString('en-IN');

/* ── App State ── */
const ST = {
  products: [],      // live from Firestore
  search: '',
  metal: [],
  type: [],
  maxPrice: 500000,
  wl: new Set(),
  mp: null,
  cart: [],
  cartOpen: false,
};

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => setTimeout(() => $('loader')?.classList.add('hide'), 2400));
setTimeout(() => $('loader')?.classList.add('hide'), 4000);

/* ============================================================
   PAGE TRANSITION
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const pt = $('page-transition');
      if (pt) {
        pt.classList.add('entering');
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
          pt.classList.remove('entering');
          pt.classList.add('leaving');
          setTimeout(() => pt.classList.remove('leaving'), 500);
        }, 250);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(()=>{
  // Skip custom cursor on touch/mobile devices
  const isTouch = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const o = $('cursor-o'), i = $('cursor-i');
  if (!o || isTouch()) return;
  let mx=0, my=0, ox=0, oy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; i.style.left=mx+'px'; i.style.top=my+'px'; });
  (function loop(){ ox+=(mx-ox)*.12; oy+=(my-oy)*.12; o.style.left=ox+'px'; o.style.top=oy+'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button,.pcard,.ccard,.nac,.sb,.gal-item,.bridal-card,.test-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
})();

/* ============================================================
   TYPED TEXT (Hero)
   ============================================================ */
(()=>{
  const el = $('ht'); if (!el) return;
  const phrases = ['Buy. Wear. Invest.','Kanak Shri Jewellers.','Pure Gold. Pure Love.','Crafted for Generations.'];
  let pi=0, ci=0, del=false;
  function tick(){
    const p = phrases[pi];
    if (!del){ el.textContent=p.slice(0,++ci); if(ci===p.length){ del=true; setTimeout(tick,2200); return; } setTimeout(tick,80); }
    else      { el.textContent=p.slice(0,--ci); if(ci===0){ del=false; pi=(pi+1)%phrases.length; setTimeout(tick,400); return; } setTimeout(tick,42); }
  }
  setTimeout(tick,2900);
})();

/* ============================================================
   PARALLAX HERO
   ============================================================ */
(()=>{
  const bgEl = document.querySelector('.hbg-img');
  if (!bgEl) return;
  // Skip parallax on mobile/touch for performance
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  window.addEventListener('scroll', () => {
    const pct = Math.min(window.scrollY / window.innerHeight, 1);
    bgEl.style.transform = `translateY(${pct * 80}px)`;
  }, { passive: true });
})();

/* ============================================================
   FLOATING PARTICLES (Hero)
   ============================================================ */
(()=>{
  const cont = document.querySelector('.hparticles');
  if (!cont) return;
  // Reduce particle count on mobile for performance
  const count = window.innerWidth < 768 ? 8 : 20;
  for (let i=0; i<count; i++) {
    const p = document.createElement('div');
    p.className = 'hparticle';
    p.style.left = Math.random()*100+'%';
    p.style.top  = Math.random()*100+'%';
    p.style.setProperty('--d',     Math.random()*2+'s');
    p.style.setProperty('--delay', -Math.random()*4+'s');
    cont.appendChild(p);
  }
})();

/* ============================================================
   NAVIGATION
   ============================================================ */
(()=>{
  const nav = $('snav'), hb = $('hbg');
  const overlay = $('snav-overlay');
  function toggleNav(open) {
    nav.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
    // Auto-close nav when a link is tapped on mobile
  }
  hb?.addEventListener('click', () => toggleNav(!nav.classList.contains('open')));
  // Close nav on link click (mobile)
  document.querySelectorAll('.nl').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 900) toggleNav(false);
    });
  });
  const secs  = [...document.querySelectorAll('section[id]')];
  const links = document.querySelectorAll('.nl');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting)
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+en.target.id));
    });
  }, { threshold: .35 });
  secs.forEach(s => obs.observe(s));
})();

/* ============================================================
   FADE-IN ON SCROLL
   ============================================================ */
function sfi(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('vis'); obs.unobserve(en.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('.fi').forEach(el => obs.observe(el));
}
sfi();

/* ============================================================
   RIPPLE EFFECT
   ============================================================ */
document.querySelectorAll('.btn-p, .btn-o').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    r.className = 'ripple-effect';
    const rect = btn.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left - 5)+'px';
    r.style.top  = (e.clientY - rect.top  - 5)+'px';
    btn.appendChild(r);
    setTimeout(()=>r.remove(), 600);
  });
});

/* ============================================================
   FEATURED SWIPER (static FD data)
   ============================================================ */
(()=>{
  const w = $('fs'); if (!w) return;
  FD.forEach(f => {
    const s = document.createElement('div');
    s.className = 'swiper-slide';
    s.innerHTML = `<img class="sli" src="${f.img}" alt="${f.name}" loading="lazy"><div class="sinf"><div class="stag">${f.tag}</div><div class="snam">${f.name}</div><div class="spri">${f.price}</div></div>`;
    w.appendChild(s);
  });
  new Swiper('.swiper-featured',{
    slidesPerView:'auto', spaceBetween:20, loop:true,
    pagination:{ el:'.swiper-pagination', clickable:true },
    autoplay:{ delay:3500, disableOnInteraction:false },
  });
})();

/* ============================================================
   CATEGORIES (static CD data)
   ============================================================ */
const CAT_MAP = {
  'Bridal Sets':'necklace','Necklaces':'necklace','Bangles':'bangle',
  'Earrings':'earring','Rings':'ring','Chains':'chain',
  'Solitaire Rings':'ring','Pendant Sets':'pendant','Stud Earrings':'earring',
  'Bracelets':'bracelet','Maang Tikka':'maagtika',
  'Anklets':'anklet','Oxidized Sets':'anklet','Pooja Articles':'pendant',
  'Gift Items':'pendant',
};

function renderC(metal){
  const g = $('cgrid'); if (!g) return;
  g.innerHTML = (CD[metal]||[]).map(c=>`
    <div class="ccard fi" data-cat="${c.name}" data-metal="${metal}" style="cursor:pointer">
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <div class="cclab"><div class="ccn">${c.name}</div><div class="ccc">${c.count} Designs</div></div>
    </div>`).join('');

  g.querySelectorAll('.ccard').forEach(card => {
    card.addEventListener('click', () => {
      const catName = card.dataset.cat;
      const metal   = card.dataset.metal;
      const typeVal = CAT_MAP[catName] || '';

      ST.metal    = [metal];
      ST.type     = typeVal ? [typeVal] : [];
      ST.search   = '';
      ST.maxPrice = 500000;

      document.querySelectorAll('[data-f="metal"]').forEach(cb => cb.checked = cb.value === metal);
      document.querySelectorAll('[data-f="type"]').forEach(cb  => cb.checked = typeVal ? cb.value === typeVal : false);
      if($('si'))  $('si').value = '';
      if($('psl')){ $('psl').value = 500000; $('pdisp').textContent = fp(500000); }

      renderP();
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  sfi();
}

document.querySelectorAll('.ctab').forEach(t => t.addEventListener('click', ()=>{
  document.querySelectorAll('.ctab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  renderC(t.dataset.cat);
}));
renderC('gold');

/* ============================================================
   ★ FIRESTORE — LIVE PRODUCT LISTENER ★
   onSnapshot fires instantly when admin adds/edits/deletes a product.
   ============================================================ */
const productsRef = collection(db, 'products');
const productsQuery = query(productsRef, orderBy('createdAt', 'desc'));

// Show loading skeleton while waiting
$('pgrid').innerHTML = `
  <div class="pcard"><div class="piw skel"></div><div class="pbd"><div class="skel" style="height:12px;width:60%;margin-bottom:.5rem"></div><div class="skel" style="height:18px;width:80%;margin-bottom:.5rem"></div><div class="skel" style="height:14px;width:40%"></div></div></div>
  <div class="pcard"><div class="piw skel"></div><div class="pbd"><div class="skel" style="height:12px;width:60%;margin-bottom:.5rem"></div><div class="skel" style="height:18px;width:80%;margin-bottom:.5rem"></div><div class="skel" style="height:14px;width:40%"></div></div></div>
  <div class="pcard"><div class="piw skel"></div><div class="pbd"><div class="skel" style="height:12px;width:60%;margin-bottom:.5rem"></div><div class="skel" style="height:18px;width:80%;margin-bottom:.5rem"></div><div class="skel" style="height:14px;width:40%"></div></div></div>`;

onSnapshot(productsQuery, (snapshot) => {
  // Build products array from Firestore docs
  ST.products = [];
  snapshot.forEach(doc => {
    ST.products.push({ id: doc.id, ...doc.data() });
  });

  // Re-render everything that depends on products
  renderP();
  renderNewArrivals();
}, (error) => {
  console.error('Firestore error:', error);
  // Fallback message if Firebase rules block access
  $('pgrid').innerHTML = `<div class="nores"><i class="far fa-gem"></i>Unable to load products. Check Firebase rules.<br><small style="font-size:.65rem;margin-top:.5rem;display:block;color:var(--gold)">${error.message}</small></div>`;
});

/* ============================================================
   NEW ARRIVALS (from Firestore products)
   ============================================================ */
function renderNewArrivals(){
  const c = $('nasc'); if (!c) return;
  c.innerHTML = '';
  const newItems = ST.products.filter(p => p.isNew === true || p.isNew === 'true');
  if (!newItems.length) { c.closest('.nas').style.display='none'; return; }
  c.closest('.nas').style.display='';
  newItems.forEach(p => {
    const d = document.createElement('div');
    d.className = 'nac fi';
    d.innerHTML = `<img src="${p.img||''}" alt="${p.name}" loading="lazy"><div class="naci"><div class="nacn">${p.name}</div><div class="nacp">${fp(p.price)}</div></div>`;
    d.addEventListener('click', () => openM(p));
    c.appendChild(d);
  });
  sfi();
}

/* ============================================================
   PRODUCT GRID — filter & render
   ============================================================ */
function starsHTML(n=4){
  return Array.from({length:5},(_,i)=>`<i class="${i<n?'fas':'far'} fa-star${i>=n?' empty':''}"></i>`).join('');
}

function filtered(){
  return ST.products.filter(p => {
    if (p.status === 'hidden') return false;
    const ms = !ST.search || p.name.toLowerCase().includes(ST.search.toLowerCase()) || (p.metal||'').includes(ST.search.toLowerCase());
    const mm = ST.metal.length===0 || ST.metal.includes(p.metal);
    const mt = ST.type.length===0  || ST.type.includes(p.type);
    const mp = Number(p.price) <= ST.maxPrice;
    return ms && mm && mt && mp;
  });
}

function renderP(){
  const g = $('pgrid'); if (!g) return;
  const r = filtered();

  if (!r.length && ST.products.length === 0){
    g.innerHTML = `<div class="nores"><i class="far fa-gem"></i>No products added yet.<br><small style="font-size:.7rem;margin-top:.5rem;display:block">Go to <a href="admin.html" style="color:var(--gold)">admin panel</a> to add products.</small></div>`;
    return;
  }
  if (!r.length){
    g.innerHTML = '<div class="nores"><i class="far fa-gem"></i>No jewellery found. Try adjusting filters.</div>';
    return;
  }

  g.innerHTML = r.map(p => `
    <div class="pcard fi" data-id="${p.id}">
      ${p.isNew==='true'||p.isNew===true ? '<div class="pbadge nb">New</div>' : p.badge ? `<div class="pbadge">${p.badge}</div>` : ''}
      <button class="pwl${ST.wl.has(p.id)?' active':''}" data-wid="${p.id}">
        <i class="${ST.wl.has(p.id)?'fas':'far'} fa-heart"></i>
      </button>
      <div class="piw">
        <img class="pim" src="${p.img||''}" alt="${p.name}" loading="lazy">
        <button class="pqv" data-qid="${p.id}">View Details</button>
      </div>
      <div class="pbd">
        <div class="pmet">${p.purity||''} ${(p.metal||'').charAt(0).toUpperCase()+(p.metal||'').slice(1)}</div>
        <div class="pnm">${p.name}</div>
        <div class="ppr">${fp(p.price)}</div>
        <div class="pwt">${p.weight||''} · ${p.stone && p.stone!=='None' ? p.stone : 'Plain'}</div>
        <div class="prating">${starsHTML(p.rating||4)}</div>
      </div>
    </div>`).join('');

  // Attach events
  g.querySelectorAll('.pqv').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    openM(ST.products.find(p=>p.id===b.dataset.qid));
  }));
  g.querySelectorAll('.pcard').forEach(c => c.addEventListener('click', e => {
    if (!e.target.closest('.pwl') && !e.target.closest('.pqv'))
      openM(ST.products.find(p=>p.id===c.dataset.id));
  }));
  g.querySelectorAll('.pwl').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const id = b.dataset.wid;
    ST.wl.has(id) ? ST.wl.delete(id) : ST.wl.add(id);
    showToast(ST.wl.has(id) ? '💛 Added to wishlist' : 'Removed from wishlist');
    renderP();
  }));
  sfi();
}

/* Filter event listeners */
$('si')?.addEventListener('input',  e => { ST.search=e.target.value; renderP(); });
$('psl')?.addEventListener('input', function(){ ST.maxPrice=+this.value; $('pdisp').textContent=fp(ST.maxPrice); renderP(); });
document.querySelectorAll('[data-f="metal"]').forEach(cb => cb.addEventListener('change', ()=>{ ST.metal=[...document.querySelectorAll('[data-f="metal"]:checked')].map(c=>c.value); renderP(); }));
document.querySelectorAll('[data-f="type"]').forEach(cb  => cb.addEventListener('change', ()=>{ ST.type=[...document.querySelectorAll('[data-f="type"]:checked')].map(c=>c.value); renderP(); }));

const ftog=$('ftog'), shf=$('shfilt'), fcls=$('fcls');
ftog?.addEventListener('click', ()=>{ shf.classList.toggle('open'); if(fcls) fcls.style.display=shf.classList.contains('open')?'block':'none'; });
fcls?.addEventListener('click', ()=>{ shf.classList.remove('open'); if(fcls) fcls.style.display='none'; });

/* ============================================================
   PRODUCT MODAL
   ============================================================ */
function openM(p){
  if (!p) return;
  ST.mp = p;
  $('mi').src          = p.img||'';
  $('mm').textContent  = `${p.purity||''} ${p.metal||''}`;
  $('mn').textContent  = p.name;
  $('mp').textContent  = fp(p.price);
  $('mw').textContent  = p.weight||'—';
  $('mpu').textContent = p.purity||'—';
  $('ms').textContent  = p.stone||'—';
  $('mt').textContent  = p.type||'—';

  // Variants
  const varOpts = VARIANTS[p.type] || VARIANTS.default;
  const vc = $('mvar-opts');
  if (vc){
    vc.innerHTML = varOpts.map((v,i)=>`<button class="mv-opt${i===0?' active':''}" data-v="${v}">${v}</button>`).join('');
    vc.querySelectorAll('.mv-opt').forEach(b=>b.addEventListener('click',()=>{
      vc.querySelectorAll('.mv-opt').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
    }));
  }

  // Wishlist button
  const wlBtn = $('mwl-btn');
  if (wlBtn){
    wlBtn.classList.toggle('active', ST.wl.has(p.id));
    wlBtn.innerHTML = `<i class="${ST.wl.has(p.id)?'fas':'far'} fa-heart"></i>&nbsp;${ST.wl.has(p.id)?'Saved':'Save to Wishlist'}`;
  }

  // Related products (same metal, different id)
  const relGrid = $('mrel-grid');
  if (relGrid){
    const related = ST.products.filter(x=>x.metal===p.metal && x.id!==p.id).slice(0,4);
    relGrid.innerHTML = related.map(r=>`<div class="mrel-item fi" data-rid="${r.id}"><img src="${r.img||''}" alt="${r.name}" loading="lazy"><p>${r.name}</p></div>`).join('');
    relGrid.querySelectorAll('.mrel-item').forEach(el=>el.addEventListener('click',()=>openM(ST.products.find(x=>x.id===el.dataset.rid))));
    sfi();
  }

  // Reviews
  const revCont = $('mrev-list');
  if (revCont){
    revCont.innerHTML = REVIEWS.map(r=>`<div class="mrev-item"><div class="mrev-stars">${starsHTML(r.stars)}</div><div class="mrev-text">${r.text}</div><div class="mrev-auth">${r.author}</div></div>`).join('');
  }

  $('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeM(){ $('modal').classList.remove('open'); document.body.style.overflow=''; }
$('mcls')?.addEventListener('click', closeM);
$('modal')?.addEventListener('click', e=>{ if(e.target===e.currentTarget) closeM(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeM(); closeCart(); closeCheckout(); } });

$('menq')?.addEventListener('click', ()=>{
  const p = ST.mp; if(!p) return;
  window.open(`https://wa.me/919999999999?text=${encodeURIComponent(`Namaste! I'm interested in "${p.name}" (${p.purity} ${p.metal}, ${fp(p.price)}). Please share more details.`)}`,'_blank');
});

$('madd')?.addEventListener('click', ()=>{
  const p = ST.mp; if(!p) return;
  const varEl = document.querySelector('#mvar-opts .mv-opt.active');
  addToCart(p, varEl ? varEl.dataset.v : 'Standard');
  closeM();
});

$('mwl-btn')?.addEventListener('click', ()=>{
  const p = ST.mp; if(!p) return;
  ST.wl.has(p.id) ? ST.wl.delete(p.id) : ST.wl.add(p.id);
  showToast(ST.wl.has(p.id) ? '💛 Added to wishlist' : 'Removed from wishlist');
  openM(p); renderP();
});

$('mzoom')?.addEventListener('click', ()=>{
  const lb=$('lightbox'); if(!lb) return;
  $('lb-img').src = $('mi').src;
  lb.classList.add('open');
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
$('lightbox')?.addEventListener('click', e=>{
  if(e.target===e.currentTarget || e.target.classList.contains('lightbox-close'))
    $('lightbox').classList.remove('open');
});

/* ============================================================
   GALLERY (static)
   ============================================================ */
(()=>{
  const g=$('gal-grid'); if(!g) return;
  GALLERY.forEach((src,i)=>{
    const d=document.createElement('div');
    d.className='gal-item fi'+(i===0?' large':'');
    d.innerHTML=`<img src="${src}" alt="Gallery ${i+1}" loading="lazy"><div class="gal-overlay"><i class="fas fa-search-plus gal-icon"></i></div>`;
    d.addEventListener('click',()=>{ $('lb-img').src=src; $('lightbox').classList.add('open'); });
    g.appendChild(d);
  });
  sfi();
})();

/* ============================================================
   TESTIMONIALS (static)
   ============================================================ */
(()=>{
  const g=$('test-grid'); if(!g) return;
  TESTIMONIALS.forEach(t=>{
    const d=document.createElement('div');
    d.className='test-card fi';
    d.innerHTML=`<div class="test-stars">${starsHTML(t.stars)}</div><div class="test-quote">"${t.text}"</div><div class="test-author"><div class="test-avatar"><i class="fas fa-user"></i></div><div><div class="test-name">${t.name}</div><div class="test-loc">${t.loc}</div></div></div>`;
    g.appendChild(d);
  });
  sfi();
})();

/* ============================================================
   TIMELINE (static)
   ============================================================ */
(()=>{
  const g=$('timeline'); if(!g) return;
  TIMELINE.forEach(t=>{
    const d=document.createElement('div');
    d.className='tl-item fi';
    d.innerHTML=`<div class="tl-dot"><i class="fas ${t.icon}"></i></div><div><div class="tl-year">${t.year}</div><div class="tl-desc">${t.desc}</div></div>`;
    g.appendChild(d);
  });
  sfi();
})();

/* ============================================================
   INSTAGRAM (static gallery)
   ============================================================ */
(()=>{
  const g=$('insta-grid'); if(!g) return;
  GALLERY.slice(0,6).forEach((src,i)=>{
    const d=document.createElement('div');
    d.className='insta-item fi';
    d.innerHTML=`<img src="${src}" alt="Instagram ${i+1}" loading="lazy"><div class="insta-ov"><i class="fab fa-instagram"></i></div>`;
    d.addEventListener('click',()=>window.open('https://instagram.com','_blank'));
    g.appendChild(d);
  });
  sfi();
})();

/* ============================================================
   CART SYSTEM
   ============================================================ */
function addToCart(product, variant='Standard'){
  const existing = ST.cart.find(i=>i.product.id===product.id && i.variant===variant);
  if (existing){ existing.qty++; } else { ST.cart.push({product, qty:1, variant}); }
  renderCart();
  showToast('🛒 Added to cart!');
  openCart();
}
function removeFromCart(productId, variant){ ST.cart=ST.cart.filter(i=>!(i.product.id===productId && i.variant===variant)); renderCart(); }
function updateQty(productId, variant, delta){ const item=ST.cart.find(i=>i.product.id===productId && i.variant===variant); if(!item)return; item.qty=Math.max(1,item.qty+delta); renderCart(); }
function cartTotal(){ return ST.cart.reduce((s,i)=>s+Number(i.product.price)*i.qty,0); }

// Expose to inline onclick handlers
window.removeFromCart = removeFromCart;
window.updateQty      = updateQty;

function renderCart(){
  const body=$('cart-body'), count=$('cart-count');
  if(!body) return;
  const totalItems = ST.cart.reduce((s,i)=>s+i.qty,0);
  if(count) count.textContent=totalItems;
  if($('cart-count-nav')) $('cart-count-nav').textContent=totalItems;
  if(!ST.cart.length){
    body.innerHTML='<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty.<br>Discover our collections.</p></div>';
    if($('cart-total-val')) $('cart-total-val').textContent='₹0';
    return;
  }
  body.innerHTML = ST.cart.map(item=>`
    <div class="cart-item">
      <img src="${item.product.img||''}" alt="${item.product.name}">
      <div class="ci-info">
        <div class="ci-name">${item.product.name}</div>
        <div class="ci-meta">${item.variant} · ${item.product.purity||''}</div>
        <div class="ci-price">${fp(item.product.price)}</div>
        <div class="ci-qty">
          <button onclick="updateQty('${item.product.id}','${item.variant}',-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.product.id}','${item.variant}',+1)">+</button>
        </div>
      </div>
      <button class="ci-del" onclick="removeFromCart('${item.product.id}','${item.variant}')"><i class="fas fa-times"></i></button>
    </div>`).join('');
  if($('cart-total-val')) $('cart-total-val').textContent=fp(cartTotal());
  if($('cart-ship'))      $('cart-ship').textContent=cartTotal()>=10000?'🎉 Free Shipping':'Shipping calculated at checkout';
}

function openCart(){  const d=$('cart-drawer'); if(d){ d.classList.add('open');    ST.cartOpen=true;  document.body.style.overflow='hidden'; } }
function closeCart(){ const d=$('cart-drawer'); if(d){ d.classList.remove('open'); ST.cartOpen=false; document.body.style.overflow='';      } }
$('cart-trigger')?.addEventListener('click', ()=> ST.cartOpen?closeCart():openCart());
$('cart-close')?.addEventListener('click', closeCart);
$('cart-checkout-btn')?.addEventListener('click', ()=>{ closeCart(); openCheckout(); });

/* ============================================================
   CHECKOUT
   ============================================================ */
function openCheckout(){
  const ov=$('checkout-overlay'); if(!ov) return;
  const rows=$('co-items');
  if(rows) rows.innerHTML=ST.cart.map(i=>`<div class="cs-row"><span>${i.product.name} × ${i.qty}</span><span>${fp(Number(i.product.price)*i.qty)}</span></div>`).join('');
  const tot=$('co-total'); if(tot) tot.textContent=fp(cartTotal());
  ov.classList.add('open');
}
function closeCheckout(){ $('checkout-overlay')?.classList.remove('open'); }
$('co-close')?.addEventListener('click', closeCheckout);
$('checkout-overlay')?.addEventListener('click', e=>{ if(e.target===e.currentTarget) closeCheckout(); });

document.querySelectorAll('.pay-method').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.pay-method').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
}));

$('co-place-order')?.addEventListener('click', async ()=>{
  const name  = $('co-name')?.value.trim();
  const phone = $('co-phone')?.value.trim();
  const city  = $('co-city')?.value.trim();
  const pm    = document.querySelector('.pay-method.active');
  if(!name||!phone||!city){ showToast('⚠️ Please fill all fields'); return; }
  if(!pm){ showToast('⚠️ Select a payment method'); return; }

  // Save order to Firestore
  try {
    await addDoc(collection(db,'orders'), {
      name, phone, city,
      email:   $('co-email')?.value.trim()||'',
      address: $('co-addr')?.value.trim()||'',
      payment: pm.dataset.method,
      items:   ST.cart.map(i=>({ name:i.product.name, qty:i.qty, price:i.product.price, variant:i.variant })),
      total:   cartTotal(),
      status:  'pending',
      createdAt: serverTimestamp(),
    });
  } catch(e){ console.warn('Order save failed (check Firestore rules):', e.message); }

  // Send WhatsApp
  const orderText = ST.cart.map(i=>`• ${i.product.name} (${i.variant}) × ${i.qty} — ${fp(Number(i.product.price)*i.qty)}`).join('\n');
  const msg = `🛒 NEW ORDER\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nPayment: ${pm.dataset.method}\n\nItems:\n${orderText}\n\nTotal: ${fp(cartTotal())}`;
  window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`,'_blank');

  closeCheckout();
  ST.cart=[];
  renderCart();
  showToast('✅ Order placed! Check WhatsApp.');
});

/* ============================================================
   APPOINTMENT BOOKING — saves to Firestore + WhatsApp
   ============================================================ */
$('appt-submit')?.addEventListener('click', async ()=>{
  const name  = $('appt-name')?.value.trim();
  const phone = $('appt-phone')?.value.trim();
  const date  = $('appt-date')?.value;
  const type  = $('appt-type')?.value;
  if(!name||!phone||!date){ showToast('⚠️ Please fill all fields'); return; }

  try {
    await addDoc(collection(db,'messages'),{
      name, phone, date, type,
      message: `Appointment: ${type} on ${date}`,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch(e){ console.warn('Message save failed:', e.message); }

  const msg = `📅 APPOINTMENT REQUEST\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nType: ${type}`;
  window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`,'_blank');
  showToast('✅ Appointment request sent!');
});

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg){
  const t=$('toast'); if(!t) return;
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer=setTimeout(()=>t.classList.remove('show'),2800);
}

/* Initial render */
renderCart();
