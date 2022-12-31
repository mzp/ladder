class AddHatenaBookmarkCount < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_items, :hatena_bookmark_count, :integer
  end
end
