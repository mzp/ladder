# frozen_string_literal: true

require 'json'

module RssChannelResponse
  def unread_count
    items.unread.count
  end

  def items_for_response
    []
  end

  def as_json(options = {})
    super(options.merge(
      only: %i[id title url description]
    )).merge(
      unreadCount: unread_count,
      items: items_for_response
    )
  end

  module WithLatestItem
    def items_for_response
      items.latest.limit(10).each do |item|
        item.extend RssItemResponse
      end
    end
  end
end
