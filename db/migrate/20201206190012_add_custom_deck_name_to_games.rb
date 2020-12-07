class AddCustomDeckNameToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :custom_deck_name, :string
  end
end
