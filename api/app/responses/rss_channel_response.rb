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
        published_at = RssItem.find(upto).published_at
        offset = items
                 .where('? <= published_at', published_at)
                 .where('id <= ?', upto)
                 .where(read_at: nil)
                 .count
        if offset == items.unread.count
          offset += items
                    .where('? <= published_at', published_at)
                    .where('id <= ?', upto)
                    .where.not(read_at: nil)
                    .count
        end
        result = items.latest.offset(offset)
      else
        result = items.latest
      end

      result.limit(10).each do |item|
        item.extend RssItemResponse
      end
    end
  end
end
