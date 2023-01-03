module CategoryResponse

  def as_json(options = {})
    super(options.merge(
      only: %i[id title]
    )).merge(channels: rss_channels)
  end
end
