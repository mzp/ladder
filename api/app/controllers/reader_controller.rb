# frozen_string_literal: true

class ReaderController < ApplicationController
  def unread
    items = RssItem.order(published_at: :desc).each do |item|
      item.extend RssItemResponse
    end
    render json: { items: }
  end
end
