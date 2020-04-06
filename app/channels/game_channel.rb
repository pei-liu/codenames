class GameChannel < ApplicationCable::Channel
  def subscribed
    @game = Game.find_by(identifier: params[:id])
    stream_for @game
  end

  def load
    # messages = Message.all.collect(&:body)
    # socket = { messages: messages, type: 'messages' }
    # ChatChannel.broadcast_to('chat_channel', socket)
  end

  def select_card(data)
    # new_game_state = # data['game_state']
    # game = Game.find_by(identifier: data['identifier'])
    # game.update(state: new_game_state)
    
    # GameChannel.broadcast_to(game)
  end

  def skip_turn
    
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
