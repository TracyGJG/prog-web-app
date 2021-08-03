import './news-article.js';
import { topHeadlinesUrl } from './newsApi.js';

window.addEventListener('load', () => {
  fetchNews(document.querySelector('main'));
  registerSW();
});

async function fetchNews(tgt) {
  const res = await fetch(topHeadlinesUrl);
  const json = await res.json();
  json.articles.forEach(article => {
    const el = document.createElement('news-article');
    el.article = article;
    tgt.appendChild(el);
  })
}

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    }
    catch (err) {
      console.error(`Register service worker failed.`)
    }
  }
  else {
    console.warn(`Service worker not supported.`)
  }
}
