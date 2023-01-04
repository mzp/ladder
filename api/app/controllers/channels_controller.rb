# frozen_string_literal: true

class ChannelsController < ApplicationController
  include UnreadCount
  def index
    channels = current_user.rss_channels.includes(:items).order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end
    render json: { channels:, categories: current_user.categories.visible }
  end

  def show
    channel = current_user.rss_channels.find(params[:id])
    channel.extend RssChannelResponse
    channel.extend RssChannelResponse::WithLatestItem

    channel.upto = params[:upto] if params[:upto].present?
    render json: channel
  end

  def update
    target = current_user.rss_channels.find(params[:id])
    target.update(params.permit(:category_id, :image_media))

    channels = RssChannel.all.order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end

    render json: channels
  end

  def mark_all_as_read
    target = current_user.rss_channels.find(params[:channel_id])
    target.items.unread.update!(read_at: Time.current)
    render json: { unreadCount: self.class.unread_count }
  end
end
