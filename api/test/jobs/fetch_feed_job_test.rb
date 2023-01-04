# frozen_string_literal: true

require 'test_helper'

# rubocop:disable Style/OpenStructUse
class FetchFeedJobTest < ActiveJob::TestCase
  test 'https://b.hatena.ne.jp/hotentry.rss' do
    item = OpenStruct.new
    item.description = 'hello'
    item.hatena_imageurl = 'https://example.com'

    result = FetchFeedJob.analyze(item)
    assert_equal 'https://example.com', result[:imageurl]
    assert_equal 'hello', result[:description]
  end

  test 'https://suer-til-blog.atsum.in/index.xml' do
    # Atom
    enclosure = OpenStruct.new
    enclosure.type = 'image/png'
    enclosure.url = 'https://example.com'
    item = OpenStruct.new
    item.enclosure = enclosure

    result = FetchFeedJob.analyze(item)
    assert_equal 'https://example.com', result[:imageurl]
  end

  test 'https://togetter.com/rss/recentpopular' do
    item = OpenStruct.new
    item.description = <<~'HTML'
      <div>
      <a href="https://togetter.com/li/2026691">
      <img width="1200" height="630" src="https://s.togetter.com/ogp2/378399a4deecf06185f7651fed48fcbe-1200x630.png"/>
      </a>
      <div>
      <a href="https://togetter.com/li/2026691">@mizutamari10ct</a>
      <h2><a href="https://togetter.com/li/2026691">仕事中にキーボード打ってただけなのにアメリカ人がこっちに来た→日本語入力を見せたらその場が湧いた</a></h2>
      </div>
      </div>
    HTML

    result = FetchFeedJob.analyze(item)
    assert_equal 'https://s.togetter.com/ogp2/378399a4deecf06185f7651fed48fcbe-1200x630.png', result[:imageurl]
    assert_no_match(/<img/, result[:description])
  end

  test 'data-src' do
    item = OpenStruct.new
    item.description = <<~'HTML'
      <img data-src="//example.com/foo.png">
    HTML

    result = FetchFeedJob.analyze(item)
    assert_equal 'https://example.com/foo.png', result[:imageurl]
  end

  test 'sanitizer' do
    item = OpenStruct.new
    item.description = <<~'HTML'
      <script></script><a href="example.com">link</a>
    HTML

    result = FetchFeedJob.analyze(item)
    assert_match(/<a/, result[:description])
    assert_no_match(/<script/, result[:description])
  end
end
# rubocop:enable Style/OpenStructUse
