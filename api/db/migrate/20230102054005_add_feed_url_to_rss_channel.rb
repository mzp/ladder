class AddFeedUrlToRssChannel < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_channels, :feed_url, :string
  end
end
