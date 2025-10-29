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
}

.post-language-switcher select {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.post-language-switcher select:hover {
  border-color: #999;
}

.post-language-switcher select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}
</style>
