# frozen_string_literal: true

class ChannelsController < ApplicationController
  def index
    channels = RssChannel.all.includes(:items)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end
    render json: channels.as_json
  end
end
