# frozen_string_literal: true

require 'json'

module RssChannelResponse
  def items
    super.order(published_at: :desc).each do |item|
      item.extend RssItemResponse
    end
  end

  def as_json(options = {})
    super(options.merge(
      only: %i[id title url],
      methods: %i[items]
    )).merge(items:)
  end
end
