# frozen_string_literal: true

require 'rss'

module RSS
  # The prefix for the Hatena XML namespace.
  HATENA_PREFIX = 'hatena'
  # The URI of the Hatena specification.
  HATENA_URI = 'http://www.hatena.ne.jp/info/xmlns#'

  module HatenaModel
    extend BaseModel

    ELEMENTS = [
      "#{HATENA_PREFIX}_imageurl",
      "#{HATENA_PREFIX}_bookmarkcount"
    ].freeze

    def self.append_features(klass)
      super

      klass.install_must_call_validator(HATENA_PREFIX, HATENA_URI)
      ELEMENTS.each do |full_name|
        name = full_name[(HATENA_PREFIX.size + 1)..]
        klass.install_text_element(name, HATENA_URI, '?', full_name)
      end
    end
  end

  prefix_size = HATENA_PREFIX.size + 1
  HatenaModel::ELEMENTS.each do |full_name|
    name = full_name[prefix_size..]
    BaseListener.install_get_text_element(HATENA_URI, name, full_name)
  end

  RDF.install_ns(HATENA_PREFIX, HATENA_URI)

  class RDF
    class Item; include HatenaModel; end
  end
end
