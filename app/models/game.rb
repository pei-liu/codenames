class Game < ApplicationRecord
  validates :identifier, presence: true, uniqueness: true
  validates :status, 
    presence: true,  
    inclusion: { in: %w(active inactive), message: "%{value} is not a valid status" }
  validates :state, presence: true

  def self.new_board(special_deck = nil)
    default_deck = load_deck('default')
    special_deck = load_deck(special_deck)

    cards = default_deck.sample(25)

    if special_deck
      # Replace some cards with special cards.
      cards.shift(4)
      cards.concat(special_deck.sample(4))
      cards.shuffle!
    end

    cards
  end

  private

  def self.load_deck(deck_name)
    path = Rails.root.join("app/assets/decks/#{deck_name}.txt")

    return unless deck_name && File.exist?(path)

    File.read(path).split("\n").map(&:upcase)
  end
end
