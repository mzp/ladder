# frozen_string_literal: true

require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  test 'index' do
    channel1 = FactoryBot.create(:rss_channel)
    channel2 = FactoryBot.create(:rss_channel)
    FactoryBot.create_list(:rss_item, 5, rss_channel: channel1)
    FactoryBot.create_list(:rss_item, 6, rss_channel: channel2)

    get items_url
    assert_response :success

    channels = response.parsed_body['channels']
    assert_equal channels.count, 2
    assert_equal 5, channels[0]['items'].count
    assert_equal 0, channels[1]['items'].count

    unread_count = response.parsed_body['unreadCount']
    assert_equal 5, unread_count[channel1.id.to_s]
    assert_equal 6, unread_count[channel2.id.to_s]
  end
end

class ItemsControllerUnreadCountTest < ActionDispatch::IntegrationTest
  def setup
    super

    @channel1 = FactoryBot.create(:rss_channel)
    @newer_item = FactoryBot.create(:rss_item, rss_channel: @channel1,
                                               published_at: 1.day.ago)
    @item = FactoryBot.create(:rss_item, rss_channel: @channel1,
                                         published_at: 2.days.ago,
                                         url: 'http://example.com')
    @older_item = FactoryBot.create(:rss_item, rss_channel: @channel1,
                                               published_at: 3.days.ago)

    @channel2 = FactoryBot.create(:rss_channel)
    @other_item = FactoryBot.create(:rss_item, rss_channel: @channel2,
                                               published_at: 1.day.ago)
    @same_item = FactoryBot.create(:rss_item, rss_channel: @channel2,
                                              published_at: 3.days.ago,
                                              url: 'http://example.com')
    post item_mark_as_read_url(@item.id)
    assert_response :success
  end

  test 'responsne' do
    read_at = response.parsed_body['readAt']
    assert_equal @item.reload.read_at.as_json, read_at
  end

  test 'newer' do
    assert_not_nil @newer_item.reload.read_at
    assert_not_nil @item.reload.read_at
    assert_nil @older_item.reload.read_at
  end

  test 'same item' do
    assert_nil @other_item.reload.read_at
    assert_not_nil @same_item.reload.read_at
  end

  test 'unread count' do
    unread_count = response.parsed_body['unreadCount']
    assert_equal 1, unread_count[@channel1.id.to_s]
    assert_equal 1, unread_count[@channel2.id.to_s]
  end
end
