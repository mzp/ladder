# frozen_string_literal: true

require 'json'

module RssItemResponse
  include ActionView::Helpers::DateHelper

  def title
    # Hatena bookmark on twitter has duplicated content
    super&.gsub(description, '...')
  end

  def imageurl
    original_url = super
    # default OGP image isn't useful
    if %w[https://anond.hatelabo.jp/images/og-image-1500.gif].include?(original_url)
      nil
    else
      original_url
    end
  end

  def site
    URI(url).host
  end

  def formatted_description
    if description.include?('<')
      description
    else
      description.gsub(URI::DEFAULT_PARSER.make_regexp) do |url|
        %(<a href="#{url}" target="_blank" class="hover:text-sky-400" style="text-decoration: underline">#{url}</a>)
      end.gsub("\n", '<br />')
    end
  end

  def date
    time_ago_in_words(published_at)
  end

  def as_json(options = {})
    super(options.merge(
      only: %i[id url content],
      methods: %i[title imageurl date site]
    )).merge(
      description: formatted_description,
      hatenaBookmarkCount: hatena_bookmark_count,
      readAt: read_at
    )
  end
end
