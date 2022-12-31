# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_12_31_101557) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "rss_channels", force: :cascade do |t|
    t.string "title"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rss_items", force: :cascade do |t|
    t.bigint "rss_channel_id", null: false
    t.string "title"
    t.string "url"
    t.string "description"
    t.string "imageurl"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "published_at"
    t.index ["rss_channel_id"], name: "index_rss_items_on_rss_channel_id"
  end

  add_foreign_key "rss_items", "rss_channels"
end
