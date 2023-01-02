# frozen_string_literal: true

class ChannelsController < ApplicationController
  def index
    channels = RssChannel.all.includes(:items)
    channels.each.with_index do |channel, index|
      channel.extend RssChannelResponse
      channel.extend RssChannelResponse::WithLatestItem if index == 0
    end
    response = channels.as_json
    render json: response
  end

  def show
    channel = RssChannel.find(params[:id])
    channel.extend RssChannelResponse
    channel.extend RssChannelResponse::WithLatestItem 
    render json: channel
  end
end
