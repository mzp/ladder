class AddContentOnRssItem < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_items, :content, :string
  end
end
