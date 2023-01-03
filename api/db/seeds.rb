# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Category.find_or_create_by(no_category: true).update(title: 'No category')
Category.find_or_create_by(nsfw: true).update(title: 'NSFW')
