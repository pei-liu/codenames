class Deck < ApplicationRecord
  DEFAULT_DECK = self.find_by(name: 'default')

  validates_presence_of :name
  validates_uniqueness_of :is_private, scope: :name

  def cards
    path = if is_private
             Rails.root.join("app/assets/decks/private/#{name}.txt")
            else
              Rails.root.join("app/assets/decks/#{name}.txt")
           end

    File.read(path).split("\n").map(&:upcase)
  end
end

