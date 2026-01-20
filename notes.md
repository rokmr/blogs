---
title: "Notes"
layout: default
permalink: /notes/
custom_class: notes-content
---

<article class="post notes-index">
  <header class="post-header">
    <h1 class="post-title">Study Notes</h1>
    <p class="post-meta">Subject-wise notes with all blog features</p>
  </header>

  <div class="post-content">
    <div class="subjects-grid">
      {% assign subject_config = "maths:Mathematics,deep-learning:Deep Learning,cv:Computer Vision,nlp-llms:NLP & LLMs,ml:Machine Learning,rl:Reinforcement Learning,mlops:MLOps" | split: "," %}
      
      {% for subject_data in subject_config %}
        {% assign parts = subject_data | split: ":" %}
        {% assign subject_slug = parts[0] %}
        {% assign subject_name = parts[1] %}
        
        {% assign all_subject_notes = site.notes | where_exp: "note", "note.path contains subject_slug" %}
        {% assign subject_notes = "" | split: "" %}
        {% for note in all_subject_notes %}
          {% assign note_name = note.path | split: '/' | last %}
          {% if note_name != 'index.md' %}
            {% assign subject_notes = subject_notes | push: note %}
          {% endif %}
        {% endfor %}
        
        <a href="{{ '/notes/' | append: subject_slug | append: '/' | relative_url }}" class="subject-card{% if subject_notes.size == 0 %} empty{% endif %}">
          <div class="subject-icon">
            {% case subject_slug %}
            {% when "maths" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M17 14v6M14 17h6"/>
            </svg>
            {% when "deep-learning" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><path d="M5 8v4a2 2 0 002 2h10a2 2 0 002-2V8M12 14v2"/>
            </svg>
            {% when "cv" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
            </svg>
            {% when "nlp-llms" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {% when "ml" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-4.24 4.24m-2.52 2.52L5.5 18.5m13-1l-4.24-4.24m-2.52-2.52L5.5 5.5"/>
            </svg>
            {% when "rl" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {% when "mlops" %}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {% endcase %}
          </div>
          <h3 class="subject-name">{{ subject_name }}</h3>
          <span class="subject-count">{% if subject_notes.size > 0 %}{{ subject_notes.size }} note{% if subject_notes.size != 1 %}s{% endif %}{% else %}Coming soon{% endif %}</span>
        </a>
      {% endfor %}
    </div>
  </div>
</article>
