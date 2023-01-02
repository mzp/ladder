# frozen_string_literal: true

class ItemsController < ApplicationController
  def mark_as_read
    item = RssItem.find(params[:id])
    read_at = Time.current
    item.update!(read_at:)

    item.rss_channel.items
        .where('? < published_at', item.published_at)
        .update(read_at:)
    RssItem.where(url: item.url).update(read_at:)
    render json: item.read_at
  end
end
