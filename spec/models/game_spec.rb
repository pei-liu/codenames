require 'rails_helper'

RSpec.describe Game, type: :model do

  let(:game) { create(:game) }

  describe '#self.create' do
    it 'populates the "state" field' do
      expect(game.state).to be
    end
  end

  describe '#set_new_board' do
    it 'alternates the turn order' do
      expect(game.state['turn_order']).to eq('blue')
      game.set_new_board
      expect(game.state['turn_order']).to eq('red')
    end

    it 'sets 25 cards' do
      expect(game.state['board'].count).to eq(25)
    end

    it 'sets the correct # of cards of each type' do
      board = game.state['board']
      blue_cards = board.count{|c| c['type'] === 'blue'}
      red_cards = board.count{|c| c['type'] === 'red'}
      neutral_cards = board.count{|c| c['type'] === 'neutral'}
      assassin_cards = board.count{|c| c['type'] === 'assassin'}

      expect(blue_cards).to eq(9) # b/c blue is starting
      expect(red_cards).to eq(8)
      expect(neutral_cards).to eq(7)
      expect(assassin_cards).to eq(1)
    end

    it 'sets all cards to be unselected' do
      expect(game.state['board'].count{|c| c['is_selected']}).to eq(0)
    end
  end

end
