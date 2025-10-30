---
layout: default
title: Blog - BattleFlow Pokémon GO PvP Anleitungen & Strategien
description: Expertenanleitungen, Strategien und Tipps für Pokémon GO PvP und die GO-Kampfliga. Lernen Sie Teambuilding, Meta-Analyse und Gewinnstrategien.
permalink: /de/blog/
lang: de
---

<div class="blog container">
  <header class="blog__header">
    <h1>Blog de BattleFlow</h1>
    <p>Guías expertas y estrategias para PvP de Pokémon GO</p>
  </header>

  <div class="blog__posts">
    {% for post in site.posts %}
    {% assign post_data = site.data.posts[post.post_id].de %}
    {% if post_data %}
    <article class="blog__post-preview">
      {% if post.featured_image %}
      <a href="/de/blog/{{ post.post_id }}/" class="blog__post-image">
        <img src="{{ post.featured_image }}" alt="{{ post_data.title }}">
      </a>
      {% endif %}

      <div class="blog__post-content">
        <h2 class="blog__post-title">
          <a href="/de/blog/{{ post.post_id }}/">{{ post_data.title }}</a>
        </h2>

        <div class="blog__post-meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%d. %B %Y" }}
          </time>
          {% if post.reading_time %}
          <span class="blog__reading-time">{{ post.reading_time }} Min. Lesezeit</span>
          {% endif %}
        </div>

        {% if post.categories %}
        <div class="blog__post-categories">
          {% for category in post.categories %}
          <span class="blog__category">{{ category }}</span>
          {% endfor %}
        </div>
        {% endif %}

        <p class="blog__post-excerpt">
          {{ post_data.description | truncate: 200 }}
        </p>

        <a href="/de/blog/{{ post.post_id }}/" class="blog__read-more">Mehr lesen →</a>
      </div>
    </article>
    {% endif %}
    {% endfor %}
  </div>
</div>
