# frozen_string_literal: true
require 'json'

class ReaderController < ApplicationController
  def unread
    items = RssItem.all.order(published_at: :desc).map do|item|
      strip(item.as_json)
    end
    render json: { items: items }
  end

  private

  def strip(item)
    if %w(https://anond.hatelabo.jp/images/og-image-1500.gif).include?(item['imageurl'])
      item.delete('imageurl')
    end
    if item['title'].include?(item['description'])
      item['title'] = item['title'].gsub(item['description'], '...')
    end
    item
  end
end
