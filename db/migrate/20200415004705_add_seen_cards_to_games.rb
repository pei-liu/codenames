class AddSeenCardsToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :seen_cards, :string, default: ''
  end
end
