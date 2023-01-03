class AddOriginalContentOnRssItem < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_items, :original_description, :string
  end
end
