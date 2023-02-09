class AddIndex2 < ActiveRecord::Migration[7.0]
  def change
     add_index :rss_items, :published_at
  end
end
