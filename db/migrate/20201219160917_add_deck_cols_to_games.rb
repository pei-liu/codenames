class AddDeckColsToGames < ActiveRecord::Migration[6.0]
  def change
    add_reference :games, :custom_deck, foreign_key: { to_table: :decks }
    add_column :games, :num_cards_included_override, :integer

    remove_column :games, :custom_deck_name, :string
  end
end
