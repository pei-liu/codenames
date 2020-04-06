class GamesController < ApplicationController
  def find_or_create
    status_code = nil
    identifier = params[:identifier]
    identifier = 'secret-lobby' if identifier == 'secretlobby'

    game = Game.find_by(identifier: identifier)

    if game
      status_code = 302 # :found
    else
      game = create_game(identifier)
      status_code = 201 # :created
    end

    render status: status_code,  json: { identifier: identifier, state: game.state }
  end

  def show; end

  private

  def create_game(identifier)
    Game.create(
      identifier: identifier,
      status: 'active',
      state: Game.new_board
    )
  end
end