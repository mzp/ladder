# frozen_string_literal: true

class ItemsController < ApplicationController
  include UnreadCount

  def index
    categories = Category.visible.includes(rss_channels: [:items])

    target_id = if params[:initial].blank?
                  RssChannel.find_by(category: Category.no_category).id
                else
                  params[:initial].to_i
                end

    categories.each do |category|
      category.extend CategoryResponse
      category.rss_channels.each do |channel|
        channel.extend RssChannelResponse
        if channel.id == target_id
          category.selected = true
          channel.extend RssChannelResponse::WithLatestItem
        end
      end
    end
    render json: { categories:, unreadCount: self.class.unread_count }
  end

  def mark_as_read
    item = RssItem.find(params[:item_id])
    read_at = Time.current
    item.update!(read_at:)

    item.rss_channel.items
        .where('? < published_at', item.published_at)
        .update(read_at:)
    RssItem.where(url: item.url).update(read_at:)
    render json: { readAt: read_at, unreadCount: self.class.unread_count }
  end
end
