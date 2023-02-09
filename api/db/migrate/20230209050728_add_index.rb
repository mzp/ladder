class AddIndex < ActiveRecord::Migration[7.0]
  def change
     add_index :rss_items, :url
     add_index :rss_items, :read_at
  end
end
