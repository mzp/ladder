# frozen_string_literal: true

require 'test_helper'

class RssItemTest < ActiveSupport::TestCase
  test 'latest' do
    channel = FactoryBot.create(:rss_channel)
    read_item = FactoryBot.create(:rss_item, rss_channel: channel, read_at: Time.current, published_at: Time.current)
    unread_item1 = FactoryBot.create(:rss_item, rss_channel: channel, read_at: nil, published_at: 1.day.ago)
    unread_item2 = FactoryBot.create(:rss_item, rss_channel: channel, read_at: nil, published_at: 2.days.ago)

    assert_equal [unread_item1, unread_item2, read_item], channel.items.latest.to_a
  end

  test 'unread' do
    channel = FactoryBot.create(:rss_channel)
    FactoryBot.create(:rss_item, rss_channel: channel, read_at: Time.current, published_at: Time.current)
    unread_item2 = FactoryBot.create(:rss_item, rss_channel: channel, read_at: nil, published_at: 2.days.ago)
    unread_item1 = FactoryBot.create(:rss_item, rss_channel: channel, read_at: nil, published_at: 1.day.ago)

    assert_equal [unread_item1, unread_item2], channel.items.unread.to_a
  end
end
