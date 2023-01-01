# frozen_string_literal: true
require 'uri'

class FetchFeedJob < ApplicationJob
  queue_as :default

  def perform(url)
    logger.info "#{self}.#{__callee__}: Fetch #{url}"

    URI(url).open do |rss|
      feed = RSS::Parser.parse(rss, false)

      record = RssChannel.find_or_create_by(url: feed.channel.link)
      record.update_from_rss!(feed.channel)
      feed.items.each do |item|
        item_record = record.items.find_or_create_by(url: item.link)
        item_record.update_from_rss!(item)
      end
    end
  end
end
