class CreateDecks < ActiveRecord::Migration[6.0]
  def change
    create_table :decks do |t|
      t.string :name, null: false
      t.boolean :is_private, null: false
      t.integer :num_cards_included, null: false, default: 4
      t.timestamps
    end

    add_index :decks, [:name, :is_private], :unique => true
  end
end
