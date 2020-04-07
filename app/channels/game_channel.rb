class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_channel_#{params[:id]}"
  end

  def receive(data)
    ActionCable.server.broadcast("game_channel_#{params[:id]}", data['new_state'])
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
