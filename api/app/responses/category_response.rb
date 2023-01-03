module CategoryResponse
  attr_accessor :selected
  def as_json(options = {})
    super(options.merge(
      only: %i[id title]
    )).merge(channels: rss_channels, selected: selected)
  end
end
