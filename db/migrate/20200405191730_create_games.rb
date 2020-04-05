class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :identifier, null: false, index: {unique: true}
      t.string :status, null: false, default: 'active'
      t.jsonb :state, null: false
      t.timestamps
    end
  end
end
