#!/usr/bin/env ruby
require 'json'
require 'open-uri'
require 'uri'
require 'nokogiri'
require 'yaml'

CHANNEL = 'minutkaprosvescheniya'
REPO = ENV['GITHUB_REPOSITORY']

def get_changed_files()
  event = JSON.parse(File.read(ENV['GITHUB_EVENT_PATH']))
  commit_shas = event['commits'].map { |c| c['id'] }
  abort "No commits found in push event!" if commit_shas.empty?
  files = []
  commit_shas.each do |sha|
    URI.open("https://api.github.com/repos/#{REPO}/commits/#{sha}") do |r|
      abort "Failed to fetch changes in commits, code: #{r.status[0]}" unless r.status[0] == "200"
      commit_data = JSON.parse(r.read)
      files.concat(commit_data['files'].map { |f| f['filename'] })
    end
  end

  files.uniq.select { |f| f =~ /.*_posts\/.*\.md\z/i }
end

def parse_post(file)
  content = File.read(file)
  parts = content.split(/^---$\n/, 3)
  data = YAML.safe_load(parts[1])
  data["_path"] = file
  data["_length"] = parts[2].length
  data
end

def fetch_posts(tg_id)
  url = "https://t.me/s/#{CHANNEL}/#{tg_id}"
  html = URI.open(url) do |r|
    code = r.status[0]
    unless code == "200"
      puts "WARN: failed to fetch #{url}: HTTP #{code}"
      return {tg_id => nil}
    end
    r.read
  end

  doc = Nokogiri::HTML(html)

  messages = doc.css('div.tgme_widget_message').map do |message_div|
    id = message_div['data-post'].split("/")[-1].to_i

    text_container = message_div.at_css('div.tgme_widget_message_bubble > div.tgme_widget_message_text')
    next nil if text_container.nil?

    text_container.search('br').each { |br| br.replace("\n") } # :harold:
    text = text_container.text.strip

    lines = text.split("\n").reject(&:empty?)
    next nil if lines.size < 2

    tags = lines[0].split(",").map { |t| t.strip.delete_prefix("#")}
    title = lines[1]

    [id, {"tags" => tags, "title" => title}]
  end.reject(&:nil?).to_h
end

def fetch_all_tg_posts(ids)
  ids_to_fetch = ids.sort.reverse
  results = {}
  until ids_to_fetch.empty?
    next_id = ids_to_fetch.pop
    posts = fetch_posts(next_id)
    ids_to_fetch -= posts.keys
    results.merge!(posts)
  end

  results
end

def check_post(post, tg_posts)
  tg_id = post["tg_id"].to_i
  path = post["_path"]
  tg_post = tg_posts[tg_id]
  return nil if not tg_post.nil? and post["title"] == tg_post["title"] and post["tags"] == tg_post["tags"]
  correct_post_id, correct_post = tg_posts.find { |k, v| v["title"] == post["title"] && v["tags"] == post["tags"] }
  case
  when ((not tg_post.nil?) and (not correct_post_id.nil?))
    "TG post with id #{tg_id}, referenced in #{path}, is incorrect: it should be #{correct_post_id}, titled #{correct_post["title"]}."
  when (correct_post_id.nil? and not tg_post.nil?)
    if (post["title"] != tg_post["title"])
      "TG post with id #{tg_id}, referenced in #{path}, has different title (#{tg_post["title"]})."
    else
      "TG post with id #{tg_id}, referenced in #{path}, has different tags (#{tg_post["tags"]})."
    end
  when (correct_post_id.nil? and tg_id == tg_posts.keys.max + 1 and post["_length"] > 1000)
    nil # articles can be published in advance
  else
    "TG post with id #{tg_id}, referenced in #{path}, hasn't been found."
  end
end

def main()
  posts = get_changed_files().map { |f| parse_post(f) }
  if posts.empty?
    puts "No changed posts in pushed commits."
    exit 0
  end

  tg_posts = fetch_all_tg_posts(posts.map{ |p| p["tg_id"].to_i })
  puts "fetched #{tg_posts.keys}"

  errors = posts.map {|p| check_post(p, tg_posts) }.select { |e| e != nil }
  if errors.empty?
    puts "No errors for tg_id in posts from pushed commits, checked #{posts.size} total."
    exit 0
  else
    errors.each { |e| puts(e) }
    exit 1
  end
end

main()
