# frozen_string_literal: true

require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  def setup
    super
    login
    @category = FactoryBot.create(:category, user: current_user)
    @channel1 = FactoryBot.create(:rss_channel, category: @category, user: current_user)
    @channel2 = FactoryBot.create(:rss_channel, category: @category, user: current_user)
    @channel3 = FactoryBot.create(:rss_channel, user: current_user)
    FactoryBot.create_list(:rss_item, 5, rss_channel: @channel1)
    FactoryBot.create_list(:rss_item, 6, rss_channel: @channel2)
    FactoryBot.create_list(:rss_item, 7, rss_channel: @channel3)
    FactoryBot.create(:rss_channel, title: 'other user channel')
  end

  test 'category' do
    get items_url, params: { initial: @channel1.id }
    categories = response.parsed_body['categories']
    assert_equal categories.count, 3

    assert_equal 1, categories[0]['channels'].count

    channels = categories[1]['channels']
    assert_equal true, categories[1]['selected']
    assert_equal channels.count, 2
    assert_equal 5, channels[0]['items'].count
    assert_equal 0, channels[1]['items'].count
  end

  test 'unread count' do
    get items_url, params: { initial: @channel1.id }
    channel_unread_count = response.parsed_body['unreadCount']['channels']
    assert_equal 5, channel_unread_count[@channel1.id.to_s]
    assert_equal 6, channel_unread_count[@channel2.id.to_s]
    assert_equal 7, channel_unread_count[@channel3.id.to_s]

    category_unread_count = response.parsed_body['unreadCount']['categories']
    assert_equal 11, category_unread_count[@category.id.to_s]
    assert_equal 7, category_unread_count[Category.no_category.id.to_s]
  end
end

class ItemsControllerUnreadCountTest < ActionDispatch::IntegrationTest
  def setup
    super

    @channel1 = FactoryBot.create(:rss_channel, user: current_user)
    @newer_item = FactoryBot.create(:rss_item, rss_channel: @channel1,
                                               published_at: 1.day.ago)
    @item = FactoryBot.create(:rss_item, rss_channel: @channel1,
                                         published_at: 2.days.ago,
                                         url: 'http://example.com')
    @older_item = FactoryBot.create(:rss_item, rss_channel: @channel1,
                                               published_at: 3.days.ago)

    @channel2 = FactoryBot.create(:rss_channel, user: current_user)
    @other_item = FactoryBot.create(:rss_item, rss_channel: @channel2,
                                               published_at: 1.day.ago)
    @same_item = FactoryBot.create(:rss_item, rss_channel: @channel2,
                                              published_at: 3.days.ago,
                                              url: 'http://example.com')

    @other_user_item = FactoryBot.create(:rss_item,
                                         published_at: 3.days.ago,
                                         url: 'http://example.com')

    login
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

  test 'other user' do
    assert_nil @other_user_item.reload.read_at
  end

  test 'unread count' do
    unread_count = response.parsed_body['unreadCount']['channels']
    assert_equal 1, unread_count[@channel1.id.to_s]
    assert_equal 1, unread_count[@channel2.id.to_s]
  end
end
