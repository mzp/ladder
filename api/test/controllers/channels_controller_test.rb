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
    FactoryBot.create_list(:category, 3)

    get channels_url
    assert_response :success

    channels = response.parsed_body['channels']
    assert_equal channels.count, 5

    categories = response.parsed_body['categories']
    assert_equal categories.count, 3
  end

  test 'should get show' do
    get channel_url(@first_channel.id)

    assert_response :success
    channel = response.parsed_body
    assert_equal 5, channel['items'].count
  end

  test 'should get show with upto' do
    channel = FactoryBot.create(:rss_channel)
    read_item = FactoryBot.create(:rss_item, published_at: 1.day.ago, rss_channel: channel, read_at: Time.current)
    FactoryBot.create(:rss_item, published_at: 1.day.ago, rss_channel: channel)
    FactoryBot.create(:rss_item, published_at: 2.days.ago, rss_channel: channel)
    time = 3.days.ago
    FactoryBot.create(:rss_item, published_at: time, rss_channel: channel)
    item = FactoryBot.create(:rss_item, published_at: time, rss_channel: channel)
    older_item1 = FactoryBot.create(:rss_item, published_at: time, rss_channel: channel)
    older_item2 = FactoryBot.create(:rss_item, published_at: 5.days.ago, rss_channel: channel)

    get channel_url(channel.id), params: { upto: item.id }

    assert_response :success
    channel = response.parsed_body
    assert_equal 3, channel['items'].count
    assert_equal older_item1.id, channel['items'][0]['id']
    assert_equal older_item2.id, channel['items'][1]['id']
    assert_equal read_item.id, channel['items'][2]['id']
  end

  test 'should get show with read' do
    channel = FactoryBot.create(:rss_channel)
    FactoryBot.create(:rss_item, published_at: 1.day.ago, rss_channel: channel, read_at: Time.current)
    item = FactoryBot.create(:rss_item, published_at: 2.days.ago, rss_channel: channel, read_at: Time.current)
    older_item1 = FactoryBot.create(:rss_item, published_at: 3.days.ago, rss_channel: channel, read_at: Time.current)
    older_item2 = FactoryBot.create(:rss_item, published_at: 4.days.ago, rss_channel: channel, read_at: Time.current)

    get channel_url(channel.id), params: { upto: item.id }

    assert_response :success
    channel = response.parsed_body
    assert_equal 2, channel['items'].count
    assert_equal older_item1.id, channel['items'][0]['id']
    assert_equal older_item2.id, channel['items'][1]['id']
  end

  test 'mark all as read' do
    post channel_mark_all_as_read_url(@first_channel.id)
    assert_response :success

    unread_count = response.parsed_body['unreadCount']
    assert_equal 0, unread_count[@first_channel.id.to_s]
    assert_equal 6, unread_count[@second_channel.id.to_s]

    assert_equal 0, @first_channel.items.reload.unread.count
  end
end
