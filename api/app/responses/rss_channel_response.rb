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
    attr_accessor :upto

    def items_for_response
      if upto
        target = RssItem.find(upto)
        if target.read?
          offset = items.read.proceeding(target).count
          result = items.read.offset(offset)
        else
          offset = items.unread.proceeding(target).count
          result = items.latest.offset(offset)
        end
      else
        result = items.latest
      end

      result.limit(10).each do |item|
        item.extend RssItemResponse
      end
    end
  end
end
