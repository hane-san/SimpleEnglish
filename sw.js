const CACHE = 'frog-english-subject-drill-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];
const PATCHES = [
  ["font-size:clamp(10.1px, 2.58vw, 12.1px);", "font-size:clamp(10.4px, 2.68vw, 12.45px);"],
  ["font-size:clamp(8.9px, 2.05vw, 10.5px);", "font-size:clamp(9.15px, 2.14vw, 10.85px);"],
  [".jp { font-size:9.8px; line-height:1.22; }", ".jp { font-size:10.05px; line-height:1.22; }"],
  [".en { font-size:8.7px; line-height:1.22; }", ".en { font-size:8.95px; line-height:1.22; }"],
  ["左の○を押している間だけ英語を表示。カード本文の左/中央/右で UK男性優先 / India男性優先 / US 音声を再生します。", "左の○を押している間だけ英語を表示。カード本文の左/中央/右で UK男性優先 / India男性優先（ごく僅かに早め） / US自然速度を再生します。"],
  ["gb: { lang:'en-GB', label:'UK male / en-GB', rate:0.96, preferred:['daniel','oliver','arthur','george','harry'] },\n      in: { lang:'en-IN', label:'India male / en-IN', rate:1.16, preferred:['rishi','ravi','raj','aarav','amit','kunal'] },\n      us: { lang:'en-US', label:'US / en-US', rate:1.12, preferred:['samantha','ava','allison','tom','alex'] }", "gb: { lang:'en-GB', label:'UK male / en-GB', rate:0.96, preferred:['daniel','oliver','arthur','george','harry'] },\n      in: { lang:'en-IN', label:'India male / en-IN', rate:1.04, preferred:['rishi','ravi','raj','aarav','amit','kunal'] },\n      us: { lang:'en-US', label:'US natural / en-US', rate:0.96, preferred:['samantha','ava','allison','tom','alex'] }"]
];
function patchHtml(html) {
  let out = html;
  for (const [from, to] of PATCHES) out = out.split(from).join(to);
  return out;
}
function isIndexRequest(request) {
  const url = new URL(request.url);
  return request.mode === 'navigate' || url.pathname.endsWith('/SimpleEnglish/') || url.pathname.endsWith('/SimpleEnglish/index.html') || url.pathname.endsWith('/index.html');
}
async function patchedIndex(request) {
  const network = await fetch(request, { cache: 'no-store' }).catch(() => null);
  const response = network || await caches.match('./index.html') || await caches.match('./');
  if (!response) return fetch(request);
  const html = await response.text();
  return new Response(patchHtml(html), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (isIndexRequest(event.request)) {
    event.respondWith(patchedIndex(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
