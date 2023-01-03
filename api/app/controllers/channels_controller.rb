# frozen_string_literal: true

class ChannelsController < ApplicationController
  def index
    channels = RssChannel.all.includes(:items).order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end
    render json: { channels:, categories: Category.all }
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
    if params[:category_id].blank?
      target.update!(category: nil)
    else
      target.update(params.permit(:category_id))
    end

    channels = RssChannel.all.order(:id)
    channels.each do |channel|
      channel.extend RssChannelResponse
    end

    render json: channels
  end
end
