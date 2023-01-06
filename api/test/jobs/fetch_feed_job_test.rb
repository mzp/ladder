# frozen_string_literal: true

require 'test_helper'

class FetchFeedJobTest < ActiveJob::TestCase
  test 'hatena:imageurl' do
    item = RSS::RDF::Item.new
    stub(item).description { 'hello' }
    stub(item).hatena_imageurl { 'https://example.com' }
    result = FetchFeedJob::Item.new(item, nil).attributes
    assert_equal 'https://example.com', result[:imageurl]
    assert_equal 'hello', result[:description]
  end

  test '<enclosure type="image/*" />' do
    # Atom
    enclosure = RSS::Rss::Channel::Item::Enclosure.new('https://example.com',
                                                       0,
                                                       'image/png')
    item = RSS::RDF::Item.new
    stub(item).enclosure { enclosure }

    result = FetchFeedJob::Item.new(item, nil).attributes
    assert_equal 'https://example.com', result[:imageurl]
  end

  test '<img src> in description' do
    item = RSS::RDF::Item.new
    stub(item).description do
      <<~'HTML'
        <img width="1200" height="630" src="http://example.com"/>
        description
      HTML
    end
    result = FetchFeedJob::Item.new(item, nil).attributes
    assert_equal 'http://example.com', result[:imageurl]
    assert_no_match(/<img/, result[:description])
  end

  test '<img data-src>' do
    item = RSS::RDF::Item.new
    stub(item).description do
      <<~'HTML'
        <img data-src="http://example.com"/>
      HTML
    end
    result = FetchFeedJob::Item.new(item, nil).attributes
    assert_equal 'http://example.com', result[:imageurl]
  end

  test '<img> in content' do
    item = RSS::RDF::Item.new
    stub(item).content_encoded do
      <<~'HTML'
        <img width="1200" height="630" src="http://example.com"/>
        description
      HTML
    end
    result = FetchFeedJob::Item.new(item, nil).attributes
    assert_equal 'http://example.com', result[:imageurl]
    assert_match(/<img/, result[:content])
  end

  test 'sanitizer' do
    item = RSS::RDF::Item.new
    stub(item).description do
      <<~'HTML'
        <script></script><a href="example.com">link</a>
      HTML
    end
    stub(item).content_encoded do
      <<~'HTML'
        <script></script><a href="example.com">link</a>
      HTML
    end

    result = FetchFeedJob::Item.new(item, nil).attributes
    assert_match(/<a/, result[:description])
    assert_no_match(/<script/, result[:description])
    assert_no_match(/<script/, result[:content])
  end
end
