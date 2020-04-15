require 'rails_helper'
require 'fakefs/spec_helpers'

RSpec.describe Game, type: :model do

  def create_test_decks
    # The fakefs gem creates a fake file system.
    # In this fake file system, replace the default.txt deck with test content.
    # Also create a 'custom.txt' deck for testing purposes.
    FakeFS do
      path = Rails.root.join("app/assets/decks/")
      default_deck_content = ''
      custom_deck_content = ''
      50.times { |i| default_deck_content += "default#{i}\n"}
      50.times { |i| custom_deck_content += "custom#{i}\n"}

      FakeFS::FileSystem.clone(path)
      File.write("#{path}/default.txt", default_deck_content)
      File.write("#{path}/custom.txt", default_deck_content)
    end
  end

  let(:game) { create(:game) }

  before do
    FakeFS do
      create_test_decks
      game.set_new_board
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

    context 'with custom_deck param' do
      it 'includes 4 cards from the custom deck' do
      end
    end
  end
end
