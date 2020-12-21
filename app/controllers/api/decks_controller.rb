module API
  class DecksController < ApplicationController
    def index
      decks = Deck.where_custom
      decks = decks.where_public unless params[:game_identifier] == 'jampzsake'

      render json: { decks: decks.to_json(only: [:id, :name, :is_private]) }
    end
  end
end
