---
layout: default
title: Blog - BattleFlow Pokémon GO PvP 指南和策略
description: Pokémon GO PvP和GO對戰聯盟的專家指南、策略和技巧。學習組隊、元分析和獲勝策略。
permalink: /zh-hant/blog/
lang: zh-Hant
---

<div class="blog container">
  <header class="blog__header">
    <h1>Blog de BattleFlow</h1>
    <p>Guías expertas y estrategias para PvP de Pokémon GO</p>
  </header>

  <div class="blog__posts">
    {% for post in site.posts %}
    {% assign post_data = site.data.posts[post.post_id].zh-hant %}
    {% if post_data %}
    <article class="blog__post-preview">
      {% if post.featured_image %}
      <a href="/zh-hant/blog/{{ post.post_id }}/" class="blog__post-image">
        <img src="{{ post.featured_image }}" alt="{{ post_data.title }}">
      </a>
      {% endif %}

      <div class="blog__post-content">
        <h2 class="blog__post-title">
          <a href="/zh-hant/blog/{{ post.post_id }}/">{{ post_data.title }}</a>
        </h2>

        <div class="blog__post-meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%Y年%m月%d日" }}
          </time>
          {% if post.reading_time %}
          <span class="blog__reading-time">{{ post.reading_time }} 分鐘</span>
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

        <a href="/zh-hant/blog/{{ post.post_id }}/" class="blog__read-more">閱讀更多 →</a>
      </div>
    </article>
    {% endif %}
    {% endfor %}
  </div>
</div>
