# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Every page is sent as full HTML (title, description, text, images with alt text, real links) so search engines and the Internet Archive can read it; the animated site replaces this plain version on load
- Structured data (JSON-LD) describing Ben Snell and each artwork
- Generated sitemap covering every page
- Open Graph tags for link previews
- Google Analytics 4 tag (`ga4_id` in `_config.yml`)
- tied up, tied down, let loose, unwound project
- Delaware Contemporary show news
- Gaia page listed

### Removed
- Old Universal Analytics tag, which stopped working in 2023
- TinyLetter newsletter link on About (TinyLetter shut down)
- Phone number from the Inquire page's search description (it's still on the page)
- Hand-written *sitemap.xml* and the per-project *index.html* files (now generated)
- tied up... availability
- Delaware Contemporary show news removed

### Changed
- Site is built by Jekyll on GitHub Pages. Each project is one file in *_projects/*, and the homepage order is in *_data/homepage.yml*. The *_json/* files the scripts read are generated from these.
- Page titles are now "Ben Snell — Artist" (home) and "<Page> — Ben Snell"; each project has its own search description
- *robots.txt* allows crawling the whole site
- Location in search descriptions is Asheville, NC
- News headline activated with Gaia show
- News headline aligned to left side of window
- News headline bar has a slight gradient from gray to light gray
- Adjust Jenny's Dreams description
- Adjust Gaia text

## [0.1.0] - 2022-04-27

### Changed
- Unlisted projects can be specified with the `unlisted:boolean` key pair in *_json/home.json*.
- Reorder social icons to start with Twitter and end with Instagram.
- Changed favicon to yellow circle.
- Updated primary *index.html* keywords
- Cleaned *.gitignore*

### Added
- Initial Cattleya project
- Cattleya page to sitemap
- Cattleya demo links

## [0.0.0] - 2022-04-27

### Changed
- Domain key from `bensnell` to `bensnell.io`
- Icon loading to use an object `icons` with paths and urls
- Check for `localhost` and `127.0.0.1` when determining if serving locally

### Added
- Additional icons for Medium, Opensea and Twitter
- Project `ritual-nature