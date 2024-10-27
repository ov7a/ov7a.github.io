source "https://rubygems.org"

gem "jekyll", "~> 3.9.0"
gem "minima", "~> 2.0"

group :jekyll_plugins do
  gem "jekyll-sitemap", "~> 1.4.0"
  gem "jekyll-paginate-v2", "~> 3.0.0"
  gem "jekyll-commonmark-ghpages", "~> 0.5.1"
  gem "jekyll-feed", "~> 0.15.1"
  gem "jekyll-redirect-from", "~> 0.16.0"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0", :platforms => [:mingw, :x64_mingw, :mswin]

# kramdown v2 ships without the gfm parser by default. If you're using
# kramdown v1, comment out this line.
gem "kramdown-parser-gfm"

