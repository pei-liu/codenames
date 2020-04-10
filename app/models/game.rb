class Game < ApplicationRecord
  RED = 'red'
  BLUE = 'blue'
  NEUTRAL = 'neutral'
  ASSASSIN = 'assassin'

  validates :identifier, presence: true, uniqueness: true
  validates :status,
    presence: true,
    inclusion: { in: %w(active inactive), message: "%{value} is not a valid status" }
  validates :state, presence: true

  def self.new_board(going_first = RED, custom_deck = nil)
    raise ArgumentError unless [RED, BLUE].include? going_first

    red_count, blue_count = going_first == RED ? [9, 8] : [8, 9]
    assassin_count = 1

    board = pick_cards(custom_deck).map do |card|
      type = if red_count > 0
               red_count -= 1
               RED
             elsif blue_count > 0
               blue_count -= 1
               BLUE
             elsif assassin_count > 0
               assassin_count -= 1
               ASSASSIN
             else
               NEUTRAL
             end
      {
        title: card,
        type: type,
        is_selected: false
      }
    end

    {
      turn_order: going_first,
      board: board.shuffle
    }
  end

  def set_new_board
    turn_order = went_first == RED ? BLUE : RED
    update(status: "active", state: self.class.new_board(turn_order))
  end

  private

  # returns Array of 25 random/shuffled cards
  def self.pick_cards(custom_deck)
    default_deck = load_deck('default')
    custom_deck = load_deck(custom_deck)

    cards = default_deck.sample(25)

    if custom_deck
      # Replace some cards with special cards.
      cards.shift(4)
      cards.concat(custom_deck.sample(4))
      cards.shuffle!
    end

    cards
  end

  def self.load_deck(deck_name)
    path = Rails.root.join("app/assets/decks/#{deck_name}.txt")

    return unless deck_name && File.exist?(path)

    File.read(path).split("\n").map(&:upcase)
  end

  def went_first
    red_card_count = state['board'].count{ |c| c['type'] === RED }
    red_card_count === 9 ? RED : BLUE
  end
end
