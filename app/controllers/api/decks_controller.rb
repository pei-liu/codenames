module API
  class DecksController < ApplicationController
    def index
      decks = Deck.where_custom
      decks = decks.where_public if params[:include_private_decks] == 'false'

      render json: { decks: decks.to_json(only: [:id, :name, :is_private]) }
    end
  end
end
