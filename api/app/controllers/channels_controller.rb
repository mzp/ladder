# frozen_string_literal: true

class ChannelsController < ApplicationController
  def index
    channels = RssChannel.all.includes(:items)
    channels.each.with_index do |channel, index|
      channel.extend RssChannelResponse
      if channel.id == params[:initial].to_i || (params[:initial].empty? && index.zero?)
        channel.extend RssChannelResponse::WithLatestItem 
      end
    end
    response = channels.as_json
    render json: response
  end

  def show
    channel = RssChannel.find(params[:id])
    channel.extend RssChannelResponse
    channel.extend RssChannelResponse::WithLatestItem

    channel.upto = params[:upto] if params[:upto].present?
    render json: channel
  end

  def update
    render json: {'status':'ok'}
  end
end
