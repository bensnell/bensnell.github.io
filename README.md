# Art Portfolio Website

The source for [bensnell.io](https://bensnell.io).

## How publishing works

Push your changes to `master`. GitHub Pages builds the site with [Jekyll](https://jekyllrb.com) and publishes it, usually within a minute. You can follow each build in the repository's **Actions** tab, where it's listed as "pages build and deployment".

Nothing needs to be built on your computer, and nothing generated is committed. If a build fails (for example, because of a typo in a project file's front matter), the previous version of the site stays live, and the Actions tab shows the error.

Each page is sent as full HTML, so search engines and the Internet Archive can read it. When the page loads, the scripts in `_scripts/` replace that plain version with the animated site. The scripts read the same content from the JSON files in `_json/`, which Jekyll generates from the project files.

## Where things live

| What | Where |
| --- | --- |
| Projects, one file each | `_projects/<address>.html`. The file name is the page's address: `_projects/dio.html` is bensnell.io/dio |
| Homepage order | `_data/homepage.yml` |
| About, News, Inquire | `about/index.html`, `news/index.html`, `inquire/index.html` |
| Images | `_assets/<project number>/`, with homepage thumbnails in `_assets/home/` |
| Site settings: name, location, social profiles, Google Analytics ID | `_config.yml` |
| Page templates: titles, descriptions, structured data | `_layouts/`, `_includes/` |
| Animation and layout scripts | `_scripts/` |

## Project files

Each project file has labeled fields between the `---` lines, then the description. Descriptions are written like before, as text with HTML for italics and links, but without JSON escaping. A blank line starts a new paragraph.

```yaml
---
number: '005'                 # image folder: _assets/005/
title: Dio
dimensions: 40 x 15.9 x 9.5 cm
material: computer, resin
year: '2018'
home:
  subtitle: On the becoming of one's creation.
  # title: Only if the homepage title differs from `title`
  # year: Only if the homepage year differs from `year`
# search_description: Optional. The text under the title in Google results.
#                     Leave it out to use the start of the description.
images:
  - 1                         # a single image: _assets/005/001.jpg
  - image: 2                  # a single image with a caption
    caption: A caption
  - set: [3, 4, 5]            # a set to flip through (click left/right)
    caption: |-
      A caption for the set
      that spans two lines
  - video: 188222790          # a Vimeo video, by ID
    size: [421, 140]          # width and height
---
I trained my computer to become a sculptor. ...

<i><a href='https://www.phillips.com/...' target='_blank'>Auctioned at Phillips</a></i>
```

A few rules:
- Write image numbers without leading zeros (`7`, not `007`). They're padded to three digits automatically.
- Put quotes around the project `number`, a `year`, and any text that contains `: ` or ` #`.
- All images are `.jpg`.

### New Project Checklist

1. If this project is not already in [Inventory](https://docs.google.com/spreadsheets/d/10KQ1D8si8kD-kuloa2qy4XtZ03lnMzTqB7bYyU_997w/edit?usp=sharing), add it and create a new project number, padded to three digits (e.g. `024`).
2. Choose the page's address, e.g. `ritual-nature`: lowercase letters, numbers and hyphens, not starting or ending with a hyphen.
3. Put the project's images in *_assets/<number>/*, named *000.jpg*, *001.jpg*, *002.jpg* and so on. Optimize them for the web (longest side under 2000 px, medium JPEG quality).
4. Add a homepage thumbnail at *_assets/home/<number>.jpg*.
5. Create *_projects/<address>.html* by copying an existing project file, then fill it in.
6. Add the address to *_data/homepage.yml* where it should appear on the homepage.

The page, its title and Google description, the sitemap and the data for the scripts are all generated from these.

## Google Analytics

The GA4 measurement ID is `ga4_id` in `_config.yml`. Set it to `""` to turn analytics off.

## Preview locally (optional)

To see changes before pushing, or to try out a branch before merging it:

1. Switch to the branch you want to see, e.g. `git fetch origin` and then `git checkout <branch>`.
2. Set up once. Use Ruby 3.3, because GitHub Pages' version of Jekyll (3.10) may not work with the newest Ruby. On a Mac with Homebrew:
   ```sh
   brew install ruby@3.3
   echo 'export PATH="$(brew --prefix ruby@3.3)/bin:$PATH"' >> ~/.zshrc
   ```
   Open a new terminal window and check that `ruby -v` shows 3.3. Then, in this folder:
   ```sh
   bundle config set --local path vendor/bundle
   bundle install
   ```
   This keeps Jekyll and its dependencies inside this folder, in `vendor/`, which git ignores.
3. Each time:
   ```sh
   bundle exec jekyll serve --livereload
   ```
   Open http://localhost:4000. The site rebuilds and the browser refreshes each time you save a file. Press Ctrl+C to stop. Warnings about "GitHub Metadata" or "faraday-retry" are harmless.

To see what search engines read, view the page source, or turn off JavaScript in the browser (in Chrome's developer tools, press Cmd+Shift+P and choose "Disable JavaScript") and reload.

The preview is built in `_site/`, which git ignores.
