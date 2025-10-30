---
layout: default
title: Blog - BattleFlow Pokémon GO PvP ガイド＆戦略
description: Pokémon GO PvPとGOバトルリーグの専門ガイド、戦略、ヒント。チーム構築、メタ分析、勝利の戦略を学びましょう。
permalink: /ja/blog/
lang: ja
---

<div class="blog container">
  <header class="blog__header">
    <h1>Blog de BattleFlow</h1>
    <p>Guías expertas y estrategias para PvP de Pokémon GO</p>
  </header>

  <div class="blog__posts">
    {% for post in site.posts %}
    {% assign post_data = site.data.posts[post.post_id].ja %}
    {% if post_data %}
    <article class="blog__post-preview">
      {% if post.featured_image %}
      <a href="/ja/blog/{{ post.post_id }}/" class="blog__post-image">
        <img src="{{ post.featured_image }}" alt="{{ post_data.title }}">
      </a>
      {% endif %}

      <div class="blog__post-content">
        <h2 class="blog__post-title">
          <a href="/ja/blog/{{ post.post_id }}/">{{ post_data.title }}</a>
        </h2>

        <div class="blog__post-meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%Y年%m月%d日" }}
          </time>
          {% if post.reading_time %}
          <span class="blog__reading-time">{{ post.reading_time }} 分</span>
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

        <a href="/ja/blog/{{ post.post_id }}/" class="blog__read-more">続きを読む →</a>
      </div>
    </article>
    {% endif %}
    {% endfor %}
  </div>
</div>
