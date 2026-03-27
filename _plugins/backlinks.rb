require 'set'

module Jekyll
  class BacklinksGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # Build map: target_url => [source posts]
      backlinks = Hash.new { |h, k| h[k] = Set.new }

      site.posts.docs.each do |post|
        post.content.scan(/\((\/\d{4}\/\d{2}\/\d{2}\/[^\)]+\.html)\)/).each do |match|
          target_url = match[0]
          backlinks[target_url] << post unless post.url == target_url
        end
      end

      site.posts.docs.each do |post|
        post.data["backlinks"] = backlinks.fetch(post.url, [])
          .sort_by { |p| p.date }
          .reverse
      end
    end
  end
end
