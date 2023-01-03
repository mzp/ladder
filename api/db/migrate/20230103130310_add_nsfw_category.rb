class AddNsfwCategory < ActiveRecord::Migration[7.0]
  def change
    add_column :categories, :nsfw, :boolean, default: false
  end
end
