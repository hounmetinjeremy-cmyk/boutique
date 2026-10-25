// Boutique - Cloudflare Worker (module ES, sans dependance)
// Panier sans JS cote client : etat dans ?items=1x2,3x1

const PRODUCTS = [
  { id: 1, name: 'T-shirt coton bio', desc: 'Unisexe', price: 1900, emoji: '👕' },
  { id: 2, name: 'Mug ceramique', desc: '300 ml', price: 1200, emoji: '☕' },
  { id: 3, name: 'Casquette', desc: 'Ajustable', price: 1500, emoji: '🧢' },
  { id: 4, name: 'Tote bag', desc: 'Toile epaisse', price: 1400, emoji: '👜' },
  { id: 5, name: 'Carnet A5', desc: 'Pages lignees', price: 900, emoji: '📓' },
  { id: 6, name: 'Gourde inox', desc: '500 ml', price: 2400, emoji: '🍶' },
  { id: 7, name: 'Stickers', desc: 'Pack de 10', price: 500, emoji: '✨' },
  { id: 8, name: 'Bougie soja', desc: 'Parfum figuier', price: 1800, emoji: '🕯' }
];

const EUR = c => (c / 100).toFixed(2) + ' EUR';
const esc = s => String(s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split(String.fromCharCode(34)).join('&quot;').split(String.fromCharCode(39)).join('&#39;');
const json = (o, st) => new Response(JSON.stringify(o, null, 2), { status: st || 200, headers: { 'content-type': 'application/json; charset=utf-8' } });
const html = (b, st) => new Response(b, { status: st || 200, headers: { 'content-type': 'text/html; charset=utf-8' } });

const STYLE = `body{margin:0;font-family:system-ui,sans-serif;background:#0f1115;color:#e8eaf0}header{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid #262a33}h1{font-size:20px;margin:0}.cart{background:#ff6b35;color:#fff;padding:10px 16px;border-radius:20px;text-decoration:none;font-weight:600}main{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));max-width:1080px;margin:24px auto;padding:0 22px}.card{background:#181b22;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:6px}.emoji{font-size:40px;text-align:center}.price{color:#ff6b35;font-weight:700}.add{margin-top:auto;background:#242a35;color:#e8eaf0;padding:10px;border-radius:9px;text-align:center;text-decoration:none}input,textarea{width:100%;margin:6px 0;padding:10px;border-radius:8px;border:1px solid #2b303b;background:#0d1015;color:#e8eaf0;box-sizing:border-box}button{background:#ff6b35;color:#fff;border:0;padding:12px 20px;border-radius:10px;font-weight:700;cursor:pointer;margin-top:12px}.box{max-width:640px;margin:24px auto;padding:0 22px}footer{max-width:1080px;margin:0 auto 40px;padding:0 22px;color:#9aa1ad}table{width:100%;border-collapse:collapse}td{padding:8px 0;border-bottom:1px solid #22262f}`;

function parseItems(sp) {
  const out = [];
  for (const part of (sp.get('items') || '').split(',')) {
    const m = /^(\d+)x(\d+)$/.exec(part.trim());
    if (!m) continue;
    const p = PRODUCTS.find(x => x.id === Number(m[1]));
    if (!p) continue;
    out.push({ ...p, qty: Math.min(Number(m[2]), 99) });
  }
  return out;
}

const serialize = items => items.map(i => i.id + 'x' + i.qty).join(',');
const total = items => items.reduce((s, i) => s + i.price * i.qty, 0);
const count = items => items.reduce((s, i) => s + i.qty, 0);

function page(title, body, n) {
  return `<!doctype html><html lang='fr'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>${esc(title)}</title><style>${STYLE}</style></head><body><header><h1>${esc(title)}</h1><a class='cart' href='/panier'>Panier (${n || 0})</a></header>${body}<footer>Boutique demo - aucun paiement reel.</footer></body></html>`;
}

function catalogue(items) {
  const qs = serialize(items);
  const prefix = qs ? qs + ',' : '';
  const cards = PRODUCTS.map(p => `<div class='card'><div class='emoji'>${p.emoji}</div><strong>${esc(p.name)}</strong><span>${esc(p.desc)}</span><span class='price'>${EUR(p.price)}</span><a class='add' href='/?items=${prefix}${p.id}x1'>Ajouter</a></div>`).join('');
  return `<main>${cards}</main>`;
}

function cartPage(items) {
  if (!items.length) return page('Panier', `<div class='box'><p>Panier vide.</p><p><a class='add' href='/'>Voir la boutique</a></p></div>`, 0);
  const rows = items.map(i => `<tr><td>${esc(i.name)}</td><td>x${i.qty}</td><td>${EUR(i.price * i.qty)}</td></tr>`).join('');
  const form = `<form method='post' action='/api/orders'><input type='hidden' name='items' value='${esc(serialize(items))}'><input name='name' placeholder='Nom' required><input name='email' type='email' placeholder='Email' required><textarea name='address' placeholder='Adresse' required></textarea><button type='submit'>Commander</button></form>`;
  return page('Panier', `<div class='box'><table>${rows}</table><p><strong>Total : ${EUR(total(items))}</strong></p>${form}</div>`, count(items));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const items = parseItems(url.searchParams);
    if (url.pathname === '/api/health') return json({ ok: true });
    if (url.pathname === '/api/products') return json(PRODUCTS);
    if (url.pathname === '/api/orders' && request.method === 'POST') {
      const f = await request.formData();
      const cart = parseItems(new URLSearchParams('items=' + (f.get('items') || '')));
      const name = (f.get('name') || '').toString().trim();
      const email = (f.get('email') || '').toString().trim();
      const address = (f.get('address') || '').toString().trim();
      if (!cart.length || !name || !email || !address) {
        return html(page('Erreur', `<div class='box'><p>Champs manquants.</p></div>`, count(cart)), 400);
      }
      const order = { id: 'CMD-' + Date.now().toString(36).toUpperCase(), at: new Date().toISOString(), name, email, address, items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })), total: total(cart) };
      if (env && env.ORDERS) await env.ORDERS.put(order.id, JSON.stringify(order));
      const body = `<div class='box'><p>Commande <strong>${order.id}</strong> enregistree.</p><p>Total : ${EUR(order.total)}</p><p><a class='add' href='/'>Retour a la boutique</a></p></div>`;
      return html(page('Confirmation', body, 0), 201);
    }
    if (url.pathname === '/panier') return html(cartPage(items), 200);
    if (url.pathname !== '/') return html(page('Introuvable', `<div class='box'><p>Page introuvable.</p><p><a class='add' href='/'>Boutique</a></p></div>`, count(items)), 404);
    return html(page('Ma boutique', catalogue(items), count(items)), 200);
  }
};
