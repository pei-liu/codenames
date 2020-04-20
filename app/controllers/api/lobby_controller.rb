module API
  class LobbyController < ApplicationController
    def index_custom_decks
      deck_names = []

      folder_path = Rails.root.join("app/assets/decks")
      deck_paths = Dir["#{folder_path}/*"]

      deck_paths.each do |deck_path|
        file_name = deck_path.split('/').last
        next if file_name == 'default.txt'
        deck_names << file_name.split('.').first
      end

      render json: {deck_names: deck_names}
    end
  end
end
