class Game < ApplicationRecord
  RED = 'red'
  BLUE = 'blue'
  NEUTRAL = 'neutral'
  ASSASSIN = 'assassin'

  validates :identifier, presence: true, uniqueness: true
  validates :status,
    presence: true,
    inclusion: { in: %w(active inactive), message: "%{value} is not a valid status" }

  belongs_to :custom_deck, class_name: 'Deck'

  def set_new_board
    @seen_cards = self.seen_cards.split(',')
    turn_order = went_first == RED ? BLUE : RED

    state = new_board(turn_order)
    @seen_cards.concat(state[:board].map{ |c| c[:title] })

    update(
      status: "active",
      state: state,
      seen_cards: @seen_cards.join(',')
    )
  end

  def cards
    self.state['board'].map{ |c| c['title'] }
  end

  private

  def new_board(going_first = RED)
    raise ArgumentError unless [RED, BLUE].include? going_first

    red_count, blue_count = going_first == RED ? [9, 8] : [8, 9]
    assassin_count = 1

    board = pick_cards.map do |card|
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

  # returns Array of 25 random/shuffled cards
  def pick_cards
    default_deck = remove_seen_cards(Deck::DEFAULT_DECK.cards)
    cards = default_deck.sample(25)

    if self.custom_deck
      # Replace some cards with special cards.
      cards.shift(4)
      custom_deck = self.custom_deck.cards - cards # ensure there are no duplicates from the custom deck
      cards.concat(custom_deck.sample(4))
      cards.shuffle!
    end

    cards
  end

  def went_first
    return RED unless state

    red_card_count = state['board'].count{ |c| c['type'] === RED }
    red_card_count === 9 ? RED : BLUE
  end

  def remove_seen_cards(cards)
    return cards if cards.blank?

    subset = cards - @seen_cards

    if subset.count < 25 # Reset deck b/c all cards have been played
      @seen_cards = []
      return cards
    end

    return subset
  end
end
