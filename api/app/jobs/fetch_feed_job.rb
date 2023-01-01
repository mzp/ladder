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
      record = RssChannel.find_or_create_by(url: channel.link)
      record.update_from_rss!(channel)

      # update item
      feed.items.each do |item|
        record.items
              .find_or_create_by(url: item.link)
              .update_from_rss!(item)
      end
    end
  end
end
