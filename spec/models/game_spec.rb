require 'rails_helper'
require 'fakefs/spec_helpers'

RSpec.describe Game, type: :model do
  PATH = Rails.root.join("app/assets/decks/")

  def create_test_decks(default_deck_content = nil, custom_deck_content = nil)
    # The fakefs gem creates a fake file system.
    # In this fake file system, replace the default.txt deck with test content.
    # Also create a 'custom.txt' deck for testing purposes.
    FakeFS do
      unless default_deck_content
        default_deck_content = ''
        51.times { |i| default_deck_content += "default#{i}\n"}
      end

      unless custom_deck_content
        custom_deck_content = ''
        9.times { |i| custom_deck_content += "custom#{i}\n"}
      end

      FakeFS::FileSystem.clone(PATH)
      File.write("#{PATH}/default.txt", default_deck_content)
      File.write("#{PATH}/custom.txt", custom_deck_content)
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

    it 'capitalizes card text' do
      expect(game.state['board'].first['title']).to match(/DEFAULT/)
    end

    it 'adds current cards in board to seen_cards' do
      expect(game.cards.join(',')).to eq(game.seen_cards)
    end

    it 'does not include seen_cards in the board' do
      FakeFS do
        seen_cards = game.seen_cards.split(',')
        game.set_new_board

        expect((game.cards - seen_cards).count).to eq(25)
      end
    end

    it 'resets seen_cards if all cards have been seen' do
      FakeFS do
        game.set_new_board # seen_cards count should now be 50
        game.set_new_board

        expect(game.seen_cards.split(',').count).to eq(25)
        expect(game.cards.count).to eq(25)
      end
    end


    context 'with custom_deck param' do
      it 'includes 4 cards from the custom deck' do
        FakeFS do
          game.set_new_board('custom')
          expect(game.state['board'].count{ |c| c['title'].match(/CUSTOM/)}).to eq(4)
        end
      end

      it 'does not include custom card that are duplicates' do
        FakeFS do
          default_deck_content = ''
          custom_deck_content = ''

          25.times{ |i| default_deck_content += "default#{i}\n" }
          100.times{ |i| custom_deck_content += "default0\n"}
          4.times{ |i| custom_deck_content += "custom#{i}\n" }

          create_test_decks(default_deck_content, custom_deck_content)

          game.set_new_board('custom')
          expect(game.cards.uniq.count).to eq(25)
        end
      end
    end
  end
end
