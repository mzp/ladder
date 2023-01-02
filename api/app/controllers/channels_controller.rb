# frozen_string_literal: true

class ChannelsController < ApplicationController
  def index
    channels = RssChannel.all.includes(:items).order(:id)
    channels.each.with_index do |channel, index|
      channel.extend RssChannelResponse
      if channel.id == params[:initial].to_i || (params[:initial].blank? && index.zero?)
        channel.extend RssChannelResponse::WithLatestItem 
      end
    end
    response = channels.as_json
    render json: { channels: response, categories: Category.all }
  end

  def show
    channel = RssChannel.find(params[:id])
    channel.extend RssChannelResponse
    channel.extend RssChannelResponse::WithLatestItem

    channel.upto = params[:upto] if params[:upto].present?
    render json: channel
  end

  def update
    channel = RssChannel.find(params[:id])
    if params[:category_id].blank?
      channel.update!(category: nil)
    else
      channel.update(params.permit(:category_id))
    end

    channels = RssChannel.all.order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end

    render json: {channels: channels}
  end
end
