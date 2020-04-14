class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_channel_#{params[:id]}"
  end

  def receive(data)
    game = Game.find_by(identifier: params[:id])
    payload = {}

    # TO DO: Figure out how to have a separate method to handle new games vs board updates
    if data['msg'] == 'newGame'
      game.set_new_board
      payload['is_new_game'] = true
    else
      game.update(state: data['new_state'])
    end

    payload['game_state'] = game.state

    ActionCable.server.broadcast("game_channel_#{params[:id]}", payload)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
