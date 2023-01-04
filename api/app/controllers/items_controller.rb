# frozen_string_literal: true

class ItemsController < ApplicationController
  include UnreadCount

  def index
    no_category = current_user.no_category
    target_id = params[:initial].presence || 
      no_category.rss_channels.first.try(:id) ||
      current_user.rss_channels.first.try(:id)

    categories = if no_category.rss_channels.empty?
                   current_user.categories.available
                 else
                   current_user.categories.visible
                 end
    categories = categories.includes(rss_channels: [:items])

    categories.each do |category|
      category.extend CategoryResponse
      category.rss_channels.each do |channel|
        channel.extend RssChannelResponse
        if channel.id == target_id.to_i
          category.selected = true
          channel.extend RssChannelResponse::WithLatestItem
        end
      end
    end
    render json: { categories:, unreadCount: self.class.unread_count }
  end

  def mark_as_read
    items = current_user.items.unread
    item = items.find(params[:item_id])
    read_at = Time.current
    item.update!(read_at:)

    item.rss_channel.items
        .where('? < published_at', item.published_at)
        .update(read_at:)
    items.where(url: item.url).update(read_at:)
    render json: { readAt: read_at, unreadCount: self.class.unread_count }
  end
end
