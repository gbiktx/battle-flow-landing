---
layout: default
title: Blog - BattleFlow 포켓몬 GO PvP 가이드 및 전략
description: 포켓몬 GO PvP 및 GO 배틀 리그를 위한 전문가 가이드, 전략 및 팁. 팀 구성, 메타 분석 및 승리 전략을 배우세요.
permalink: /ko/blog/
lang: ko
---

<div class="blog container">
  <header class="blog__header">
    <h1>Blog de BattleFlow</h1>
    <p>Guías expertas y estrategias para PvP de Pokémon GO</p>
  </header>

  <div class="blog__posts">
    {% for post in site.posts %}
    {% assign post_data = site.data.posts[post.post_id].ko %}
    {% if post_data %}
    <article class="blog__post-preview">
      {% if post.featured_image %}
      <a href="/ko/blog/{{ post.post_id }}/" class="blog__post-image">
        <img src="{{ post.featured_image }}" alt="{{ post_data.title }}">
      </a>
      {% endif %}

      <div class="blog__post-content">
        <h2 class="blog__post-title">
          <a href="/ko/blog/{{ post.post_id }}/">{{ post_data.title }}</a>
        </h2>

        <div class="blog__post-meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%Y년 %m월 %d일" }}
          </time>
          {% if post.reading_time %}
          <span class="blog__reading-time">{{ post.reading_time }} 분</span>
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

        <a href="/ko/blog/{{ post.post_id }}/" class="blog__read-more">더 읽기 →</a>
      </div>
    </article>
    {% endif %}
    {% endfor %}
  </div>
</div>
