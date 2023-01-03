# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    sequence :title do |n|
      "category title #{n}"
    end
  end
end
