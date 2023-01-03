# frozen_string_literal: true

class ChannelsController < ApplicationController
  include UnreadCount
  def index
    channels = RssChannel.all.includes(:items).order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end
    render json: { channels:, categories: Category.visible }
  end

  def show
    channel = RssChannel.find(params[:id])
    channel.extend RssChannelResponse
    channel.extend RssChannelResponse::WithLatestItem

    channel.upto = params[:upto] if params[:upto].present?
    render json: channel
  end

  def update
    target = RssChannel.find(params[:id])
    target.update(params.permit(:category_id))

    channels = RssChannel.all.order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end

    render json: channels
  end

  def mark_all_as_read
    target = RssChannel.find(params[:channel_id])
    target.items.unread.update!(read_at: Time.current)
    render json: { unreadCount: self.class.unread_count(RssChannel.all) }
  end
end
