module API
  class GamesController < ApplicationController
    def find_or_create
      status_code = nil
      identifier = params[:identifier]
      identifier = 'secret-lobby' if identifier == 'secretlobby'

      game = Game.find_by(identifier: identifier)

      if game
        status_code = 302 # :found
      else
        game = create_game(identifier, params[:custom_deck])
        status_code = 201 # :created
      end

      json = { identifier: identifier, state: game.state, custom_deck: game.custom_deck_name }

      render status: status_code,  json: json
    end

    def show
      game = Game.find_by(identifier: params[:identifier])
      if game
        render status: 200, json: { custom_deck: game.custom_deck_name, state: game.state }
      else
        # TO DO
        # 404
      end
    end

    private

    def create_game(identifier, custom_deck = nil)
      game = Game.create(
        identifier: identifier,
        status: 'active',
        custom_deck_name: custom_deck
      )
      game.set_new_board
      game
    end
  end
end
