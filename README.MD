Archived, probably no longer working. Please try - https://github.com/erikelisath/keep-to-markdown

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.org/vHanda/google-keep-exporter.svg?branch=master)](https://travis-ci.org/vHanda/google-keep-exporter) [![Coverage Status](https://coveralls.io/repos/github/vHanda/google-keep-exporter/badge.svg?branch=master)](https://coveralls.io/github/vHanda/google-keep-exporter?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/vhanda/google-keep-exporter/badge.svg)](https://snyk.io/test/github/vhanda/google-keep-exporter)

<h1 align="center">
  Google Keep Converter
</h1>

<p align="center">
Convert your Google Keep notes into a standard markdown + YAML header format.
</p>

## How to use

1. Get your Keep notes from [Google Takeout](https://www.google.com/settings/takeout/custom/keep)
2. Download the latest [release](https://github.com/vHanda/google-keep-exporter/releases/latest)
3. Run -

`./google-keep-exporter-linux inputZip outputDir`

or

`./google-keep-exporter-macos inputZip outputDir`

or

`./google-keep-exporter-win.exe inputZip outputDir`

## Running from source

```
git clone git@github.com:vHanda/google-keep-exporter.git
cd google-keep-exporter
npm install
npm run build
node dist/main.js <input> <outputDir>
```
