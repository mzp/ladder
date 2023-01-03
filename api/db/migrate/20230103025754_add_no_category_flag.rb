class AddNoCategoryFlag < ActiveRecord::Migration[7.0]
  def change
    add_column :categories, :no_category, :boolean, default: false
  end
end
