# frozen_string_literal: true

class ChannelsController < ApplicationController
  skip_before_action :verify_authenticity_token

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

  def new
    url = params[:url]
    urls = self.class.discover URI(url).read, url
    render json: { urls: }
  end

  def create
    url = params[:url]
    FetchFeedJob.perform_later url
    render json: []
  end

  def update
    target = current_user.rss_channels.find(params[:id])
    target.update(params.permit(:category_id, :image_media))

    channels = current_user.channels.order(:id)
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

  class << self
    def discover(content, base_url)
      html = Nokogiri::HTML(content)
      links = html.css('link[href][type]').select do |link|
        type = link.attributes['type']&.value
        %(application/rss+xml application/atom+xml).include? type
      end

      links.map { |link| URI.join(base_url, link.attributes['href'].value).to_s }
    end
  end
end
