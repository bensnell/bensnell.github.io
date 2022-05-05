# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Unlisted projects can be specified with the `unlisted:boolean` key pair in *_json/home.json*.
- Reorder social icons to start with Twitter and end with Instagram.

### Added
- Initial Cattleya project (unlisted)

## [0.0.0] - 2022-04-27

### Changed
- Domain key from `bensnell` to `bensnell.io`
- Icon loading to use an object `icons` with paths and urls
- Check for `localhost` and `127.0.0.1` when determining if serving locally

### Added
- Additional icons for Medium, Opensea and Twitter
- Project `ritual-nature