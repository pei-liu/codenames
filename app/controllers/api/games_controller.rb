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
        game = create_game(identifier, params[:custom_deck_id])
        status_code = 201 # :created
      end

      json = { identifier: identifier, state: game.state, custom_deck: game.custom_deck&.name }

      render status: status_code,  json: json
    end

    def show
      game = Game.find_by(identifier: params[:identifier])
      if game
        render status: 200, json: { custom_deck: game.custom_deck&.name , state: game.state }
      else
        render status: 404, body: nil
      end
    end

    private

    def create_game(identifier, custom_deck_id = nil)
      game = Game.create(
        identifier: identifier,
        status: 'active',
        custom_deck_id: custom_deck_id
      )
      game.set_new_board
      game
    end
  end
end
