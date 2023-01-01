class AddUnreadToRssItem < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_items, :read_at, :datetime
  end
end
