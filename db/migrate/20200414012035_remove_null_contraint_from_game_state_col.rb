class RemoveNullContraintFromGameStateCol < ActiveRecord::Migration[6.0]
  def change
    change_column_null :games, :state, true
  end
end
