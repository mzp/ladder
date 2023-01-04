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
        original_description: item.description,
        original_content: item.try(:content_encoded),
        content: item.try(:content_encoded),
        description: item.description,
        imageurl: item.try(:hatena_imageurl) || thumbnail_enclosure(item),
        title: item.title,
        published_at: item.date || Time.zone.now,
        hatena_bookmark_count: item.try(:hatena_bookmarkcount).to_i
      }
      %i[parse_html scrub].reduce(result) do |arg, name|
        send name, arg
      end
    end

    def scrub(item)
      scrubber = Rails::Html::PermitScrubber.new
      scrubber.tags = %w[a h1 h2 h3 h4 h5 h6 div p span ul li ol prei
                         b blockquote br code em i img
                         strong table td tr ul]
      description = Loofah.fragment(item[:description])
      description.scrub!(scrubber)

      content = if item[:content]
                  content = Loofah.fragment(item[:content])
                  content.scrub!(scrubber)
                  content.to_s
                end

      item.merge(description: description.to_s, content:)
    end

    def thumbnail_enclosure(item)
      return unless item.try(:enclosure).try(:type) =~ %r{image/*}

      item.enclosure.url
    end

    def parse_html(item)
      return item if item[:imageurl].present?

      description = Nokogiri::HTML(item[:description])
      image_tag = description.at('img')
      if image_tag
        imageurl = image_url(image_tag)
        image_tag.remove

        item.merge({ imageurl:, description: description.to_html })
      elsif item[:content]
        content = Nokogiri::HTML(item[:content])
        image_tag = content.at('img')
        imageurl = image_url(image_tag)
        item.merge({ imageurl: })
      else
        item
      end
    rescue StandardError => e
      Rails.logger.error "Can't parse feed: #{e}"
      item
    end

    def image_url(tag)
      hash = tag.attributes
      url = hash['src']&.value || hash['data-src']&.value

      return unless url

      uri = URI(url)
      # fix scheme
      uri.scheme ||= 'https'
      uri.to_s
    end
  end
end
