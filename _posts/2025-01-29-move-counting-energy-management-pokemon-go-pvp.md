---
layout: post
date: 2025-01-29
author: Gabriel Aguirre
categories: [Advanced Strategy, Energy Management]
tags:
  [
    pokemon go,
    pvp,
    energy management,
    move counting,
    charge move timing,
    fast moves,
    turn timing,
  ]
reading_time: 10
featured_image: /assets/images/screenshots/2.png
post_id: move-counting-energy-management-pokemon-go-pvp
---

{% assign lang = page.lang | default: site.default_lang | default: "en" %}
{% assign post_data = site.data.posts[page.post_id][lang] %}

{% if post_data %}
  <h1 class="post__title">{{ post_data.title }}</h1>
  <meta name="description" content="{{ post_data.description }}">

  {{ post_data.content | markdownify }}
{% else %}
  <!-- Fallback to English if translation not found -->
  {% assign post_data_en = site.data.posts[page.post_id]["en"] %}
  <h1 class="post__title">{{ post_data_en.title }}</h1>
  <meta name="description" content="{{ post_data_en.description }}">

  {{ post_data_en.content | markdownify }}
{% endif %}

<script>
// Language selector for blog posts
(function() {
  const currentPath = window.location.pathname;
  const postSlug = '{{ page.post_id }}';

  // Add language selector if not already present
  if (!document.querySelector('.post-language-switcher')) {
    const header = document.querySelector('.post__header');
    if (header) {
      const switcher = document.createElement('div');
      switcher.className = 'post-language-switcher';
      switcher.innerHTML = `
        <select id="post-language-select" onchange="switchPostLanguage(this.value)" aria-label="Select Language">
          <option value="en" ${currentPath === '/blog/${postSlug}/' ? 'selected' : ''}>English</option>
          <option value="es" ${currentPath.includes('/es/') ? 'selected' : ''}>Español</option>
          <option value="fr" ${currentPath.includes('/fr/') ? 'selected' : ''}>Français</option>
          <option value="de" ${currentPath.includes('/de/') ? 'selected' : ''}>Deutsch</option>
          <option value="it" ${currentPath.includes('/it/') ? 'selected' : ''}>Italiano</option>
          <option value="pt" ${currentPath.includes('/pt/') ? 'selected' : ''}>Português</option>
          <option value="zh-Hans" ${currentPath.includes('/zh-hans/') ? 'selected' : ''}>简体中文</option>
          <option value="zh-Hant" ${currentPath.includes('/zh-hant/') ? 'selected' : ''}>繁體中文</option>
          <option value="ja" ${currentPath.includes('/ja/') ? 'selected' : ''}>日本語</option>
          <option value="ko" ${currentPath.includes('/ko/') ? 'selected' : ''}>한국어</option>
        </select>
      `;
      header.insertBefore(switcher, header.firstChild);
    }
  }
})();

function switchPostLanguage(lang) {
  const postSlug = '{{ page.post_id }}';
  const langMap = {
    'en': `/blog/${postSlug}/`,
    'es': `/es/blog/${postSlug}/`,
    'fr': `/fr/blog/${postSlug}/`,
    'de': `/de/blog/${postSlug}/`,
    'it': `/it/blog/${postSlug}/`,
    'pt': `/pt/blog/${postSlug}/`,
    'zh-Hans': `/zh-hans/blog/${postSlug}/`,
    'zh-Hant': `/zh-hant/blog/${postSlug}/`,
    'ja': `/ja/blog/${postSlug}/`,
    'ko': `/ko/blog/${postSlug}/`
  };

  if (langMap[lang]) {
    localStorage.setItem('preferredLanguage', lang);
    window.location.href = langMap[lang];
  }
}
</script>

<style>
.post-language-switcher {
  margin-bottom: 1.5rem;
  position: relative;
}

.post-language-switcher select {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  max-width: 250px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  padding-right: 3rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.post-language-switcher select:hover {
  border-color: #5A51FE;
  box-shadow: 0 2px 8px rgba(90, 81, 254, 0.15);
}

.post-language-switcher select:focus {
  outline: none;
  border-color: #5A51FE;
  box-shadow: 0 0 0 3px rgba(90, 81, 254, 0.15);
}

@media (max-width: 768px) {
  .post-language-switcher {
    margin-bottom: 1rem;
  }

  .post-language-switcher select {
    padding: 0.65rem 1rem;
    font-size: 0.95rem;
    max-width: 100%;
    border-radius: 6px;
    background-position: right 0.75rem center;
    padding-right: 2.5rem;
  }
}

/* Touch-friendly tap targets */
@media (max-width: 768px) {
  .post-language-switcher select {
    min-height: 44px; /* Apple's recommended minimum tap target size */
  }
}

/* Better visual feedback for mobile */
@media (max-width: 768px) {
  .post-language-switcher select:active {
    transform: scale(0.98);
  }
}
</style>
