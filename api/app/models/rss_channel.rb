# frozen_string_literal: true

require 'open-uri'
require 'rss/hatena'

class RssChannel < ApplicationRecord
  has_many :rss_item, dependent: :destroy

  def update_from_rss!(channel)
    logger.info "#{self.class}##{__callee__}: Update #{channel.title} - #{channel.link}"
    update!(title: channel.title)
  end

  class << self
    # TODO: Move to fetch job
    def fetch(url)
      logger.info "#{self}.#{__callee__}: Fetch #{url}"

      url.open do |rss|
        feed = RSS::Parser.parse(rss)
        record = RssChannel.find_or_create_by(url: feed.channel.link)
        record.update_from_rss!(feed.channel)
        feed.items.each do |item|
          item_record = RssItem.find_or_create_by(url: item.link, rss_channel: record)
          item_record.update_from_rss!(item)
        end
      end
    end
  end
end
