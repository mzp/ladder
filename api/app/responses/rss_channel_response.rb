# frozen_string_literal: true

require 'json'

module RssChannelResponse
  def items_for_response
    []
  end

  def channel_title
    override_title.presence || title
  end

  def as_json(options = {})
    super(options.merge(
      only: %i[id url description category_id]
    )).merge(
      items: items_for_response,
      isImageMedia: image_media,
      title: channel_title,
      originalTitle: title
    )
  end

  module WithLatestItem
    attr_accessor :page

    def page_size
      image_media ? 5 : 10
    end

    def items_for_response
      latest = items.latest.offset(page.to_i * page_size).limit(page_size)
      latest.each do |item|
        item.extend RssItemResponse
      end
      latest
    end

    def as_json(options = {})
      super(options).merge(page: page.to_i)
    end
  end
end
