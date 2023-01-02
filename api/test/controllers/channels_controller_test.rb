# frozen_string_literal: true

require 'test_helper'

class ChannelsControllerTest < ActionDispatch::IntegrationTest
  def setup
    super

    @first_channel, @second_channel, = FactoryBot.create_list(:rss_channel, 5)
    FactoryBot.create_list(:rss_item, 5, rss_channel: @first_channel)
    FactoryBot.create_list(:rss_item, 6, rss_channel: @second_channel)
  end

  test 'should get index' do
    get channels_url
    assert_response :success

    channels = response.parsed_body
    assert_equal channels.count, 5

    first_channel = channels[0]
    assert_equal 5, first_channel['items'].count
    assert_equal 5, first_channel['unreadCount']

    second_channel = channels[1]
    assert_equal 0, second_channel['items'].count
    assert_equal 6, second_channel['unreadCount']
  end

  test 'should get show' do
    get channel_url(@first_channel.id)

    assert_response :success
    channel = response.parsed_body
    assert_equal 5, channel['items'].count
  end
end
