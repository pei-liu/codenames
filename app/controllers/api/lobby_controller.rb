module API
  class LobbyController < ApplicationController
    def index_custom_decks
      deck_names = []
      path = Rails.root.join("app/assets/decks/")
      Dir.entries(path)[2..-1].each do |file|
        next if file === 'default.txt'
        deck_names << file.split('.').first
      end

      render json: {deck_names: deck_names}
    end
  end
end
