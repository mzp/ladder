# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence :username do |n|
      "user-#{n}"
    end
    password { 'password' }
    salt { 'salt' }
  end
end
