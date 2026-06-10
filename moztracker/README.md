# Moz Tracker

**Will Morrissey actually show up?**

A standalone browser app tracking the next 5 upcoming Morrissey concerts, each with a statistically dubious cancellation risk percentage.

Live at: **https://klm-snyk.github.io/moztracker/**

---

## What it does

- Lists the next 5 confirmed Morrissey shows (date, venue, city/country)
- Calculates a cancellation risk % per show based on:
  - Base rate (~35%, reflecting his documented history)
  - Days until the show
  - Geographic region (Scandinavian shows score better; US shows score worse)
  - Back-to-back show fatigue
- Displays a **Moz-o-meter** — overall tour vibe and average cancel risk
- Cycling slideshow of concert photos (Wikimedia Commons, CC licensed) as background

## Updating show data

Edit the `shows` array in the `<script>` block of `index.html`. Each show takes:

```js
{
  date: 'YYYY-MM-DD',        // or null for TBA
  venue: 'Venue Name',
  city: 'City',
  country: 'Country',
  flag: '🇺🇸',
  riskFactors: [
    { label: 'Some context', type: 'good' },   // green chip
    { label: 'Some concern', type: 'bad' },    // red chip
    { label: 'Neutral note', type: 'neutral' } // grey chip
  ]
}
```

## Tech

Pure HTML/CSS/JS — no build step, no dependencies beyond Google Fonts. One file.

## Photo credits

Concert photos sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Morrissey) under Creative Commons licences.
