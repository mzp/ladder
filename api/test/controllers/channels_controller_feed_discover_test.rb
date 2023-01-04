# frozen_string_literal: true

require 'test_helper'
class ChannelsControllerFeedDiscoverTest < ActionDispatch::IntegrationTest
  test 'link' do
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

  test 'rss feed itself' do
    html = <<~'HTML'
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:admin="http://webns.net/mvcb/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:hatena="http://www.hatena.ne.jp/info/xmlns#" xmlns:syn="http://purl.org/rss/1.0/modules/syndication/" xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/">
      <channel rdf:about="https://b.hatena.ne.jp/hotentry/all">
      <title>はてなブックマーク - 人気エントリー - 総合</title>
      <link>https://b.hatena.ne.jp/hotentry/all</link>
      <description>最近の人気エントリー</description>
      <item>
      </item>
      </channel>
      </rdf:RDF>

    HTML

    urls = ChannelsController.discover html, 'https://b.hatena.ne.jp/hotentry.rss'
    assert_includes urls, 'https://b.hatena.ne.jp/hotentry.rss'
  end
end
