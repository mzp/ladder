# frozen_string_literal: true

require 'test_helper'

class ChannelsControllerTest < ActionDispatch::IntegrationTest
  def setup
    super

    @first_channel, @second_channel, = FactoryBot.create_list(:rss_channel, 5, user: current_user)
    FactoryBot.create_list(:rss_item, 5, rss_channel: @first_channel)
    FactoryBot.create_list(:rss_item, 6, rss_channel: @second_channel)

    FactoryBot.create_list(:rss_channel, 2)
    login
  end

  test 'should get index' do
    FactoryBot.create_list(:category, 3, user: current_user)

    get channels_url
    assert_response :success

    channels = response.parsed_body['channels']
    assert_equal channels.count, 5

    categories = response.parsed_body['categories']
    assert_equal categories.count, 5
  end

  test 'should get show' do
    get channel_url(@first_channel.id)

    assert_response :success
    channel = response.parsed_body
    assert_equal 5, channel['items'].count
  end

  test 'should get show with upto' do
    channel = FactoryBot.create(:rss_channel, user: current_user)
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
    channel = FactoryBot.create(:rss_channel, user: current_user)
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

    unread_count = response.parsed_body['unreadCount']['channels']
    assert_equal 0, unread_count[@first_channel.id.to_s]
    assert_equal 6, unread_count[@second_channel.id.to_s]

    assert_equal 0, @first_channel.items.reload.unread.count
  end

  test 'new' do
    html = <<~'HTML'
      <html>
        <head>
          <link rel="shortcut icon" href="/favicon.ico">
          <meta name="generator" content="Hugo 0.101.0">
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css" crossorigin="anonymous">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3">
          <link rel="alternate" type="application/rss+xml" href="https://suer-til-blog.atsum.in/index.xml" title="suer TIL">
          <link rel="alternate" type="application/atom+xml" href="/atom.xml" title="suer TIL">
          <title>suer TIL</title>
         </head>
        <body />
      </html>
    HTML

    urls = ChannelsController.discover html, 'https://suer-til-blog.atsum.in/'
    assert_includes urls, 'https://suer-til-blog.atsum.in/index.xml'
    assert_includes urls, 'https://suer-til-blog.atsum.in/atom.xml'
  end
end
