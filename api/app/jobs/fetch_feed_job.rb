# frozen_string_literal: true

require 'uri'
require 'rss/hatena'

class FetchFeedJob < ApplicationJob
  queue_as :default

  def perform(url)
    logger.info "#{self}.#{__callee__}: Fetch #{url}"

    URI(url).open do |rss|
      feed = RSS::Parser.parse(rss, false)

      # update channel
      channel = feed.channel
      record = RssChannel.find_or_create_by(feed_url: url)
      record.update_from_rss!(channel)

      # update item
      feed.items.each do |item|
        record.items
              .find_or_create_by(url: item.link)
              .update!(self.class.analyze(item))
      end
    end
  end

  class << self
    def analyze(item)
      result = {
        description: item.description,
        imageurl: item.try(:hatena_imageurl) || thumbnail_enclosure(item),
        title: item.title,
        published_at: item.date || Time.zone.now,
        hatena_bookmark_count: item.try(:hatena_bookmarkcount).to_i
      }.merge(parse_html(item.description))

      result[:description] = scrub(result[:description])
      result
    end

    def scrub(description)
      scrubber = Rails::Html::PermitScrubber.new
      scrubber.tags = %w[a h1 h2 h3 h4 h5 h6 div p span ul li ol prei
                         b blockquote br code em i img
                         strong table td tr ul]

      html_fragment = Loofah.fragment(description)
      html_fragment.scrub!(scrubber)
      html_fragment.to_s 
    end

    def thumbnail_enclosure(item)
      return unless item.try(:enclosure).try(:type) =~ %r{image/*}

      item.enclosure.url
    end

    def parse_html(description)
      html = Nokogiri::HTML(description)
      image_tag = html.at('img[src]')
      return {} if image_tag.blank?

      imageurl = image_tag.attributes['src'].value
      image_tag.remove

      { imageurl:, description: html.to_html }
    rescue StandardError => e
      Rails.logger.error "Can't parse feed: #{e}"
      {}
    end
  end
end
