# frozen_string_literal: true

require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  test 'index' do
    FactoryBot.create_list(:rss_item, 5, rss_channel: FactoryBot.create(:rss_channel))
    FactoryBot.create_list(:rss_item, 6, rss_channel: FactoryBot.create(:rss_channel))

    get items_url
    assert_response :success

    channels = response.parsed_body['channels']
    assert_equal channels.count, 2

    first_channel = channels[0]
    assert_equal 5, first_channel['items'].count
    assert_equal 5, first_channel['unreadCount']

    second_channel = channels[1]
    assert_equal 0, second_channel['items'].count
    assert_equal 6, second_channel['unreadCount']
  end


  test 'mark as read' do
    channel1 = FactoryBot.create(:rss_channel)
    channel2 = FactoryBot.create(:rss_channel)
    newer_item = FactoryBot.create(:rss_item, published_at: 1.day.ago, rss_channel: channel1)
    item = FactoryBot.create(:rss_item, published_at: 2.days.ago, url: 'http://example.com', rss_channel: channel1)
    older_item = FactoryBot.create(:rss_item, published_at: 3.days.ago, rss_channel: channel1)

    other_item = FactoryBot.create(:rss_item, published_at: 1.day.ago, rss_channel: channel2)
    same_item = FactoryBot.create(:rss_item, published_at: 3.days.ago, url: 'http://example.com', rss_channel: channel2)

    post item_mark_as_read_url(item.id)
    assert_response :success

    assert_not_nil newer_item.reload.read_at
    assert_not_nil item.reload.read_at
    assert_nil older_item.reload.read_at

    assert_nil other_item.reload.read_at
    assert_not_nil same_item.reload.read_at
  end
end
