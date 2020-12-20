namespace :util do
  # rake util:deck_and_game_cleanup
  desc "Ensure text files and decks db records are in sync"
  task :deck_and_game_cleanup, [:dry_run] => :environment do |_t, args|
  # task :send, [:username] => [:environment] do |t, args|
    is_dry_run = true unless args[:dry_run] == 'f'

    folder_path = Rails.root.join("app/assets/decks")

    deck_paths = Dir["#{folder_path}/**/*.txt"]
    public_decks = Dir["#{folder_path}/*.txt"].map { |path| File.basename(path, '.txt') }
    private_decks = Dir["#{folder_path}/private/*.txt"].map { |path| File.basename(path, '.txt') }

    # Ensure `decks.is_private` is correct
    Deck.where(name: public_decks).update(is_private: false)
    Deck.where(name: private_decks).update(is_private: true)

    # Destroy decks and games where the text file no longer exists

    decks_to_destroy = Deck.where.not(name: public_decks.concat(private_decks))

    decks_to_destroy.each { |d| puts "- Deck: [#{d.id}, #{d.name}] / Game Count: #{d.games.count}" }

    puts "Above decks/games to be destroyed."

    if is_dry_run
      puts "This is a dry run. No db updates have been made."
      puts "Run `rake util:deck_and_game_cleanup[f]` for real deal."
    else
      decks_to_destroy.destroy_all
      puts "Done"
    end
  end

  desc "Checks if there are any dups within each deck"
  # rake util:check_dups_within_decks
  task check_dups_within_decks: :environment do
    dups_found = false
    folder_path = Rails.root.join("app/assets/decks")
    deck_paths = Dir["#{folder_path}/*.txt"]
    deck_paths.each do |deck_path|
      file_name = deck_path.split('/').last
      cards = File.read(deck_path).split("\n").map(&:upcase)

      set = Set.new
      dup_cards = cards.select { |c| !set.add?(c) }

      if dup_cards.any?
        dups_found = true
        puts "#{file_name}: Following words are duplicated"
        puts dup_cards
      end
    end

    puts "No dups found within decks" unless dups_found
  end

  desc "Checks if any custom decks contain cards already in the default deck"
  # rake util:check_dups_between_decks
  task check_dups_between_decks: :environment do
    dups_found = false
    folder_path = Rails.root.join("app/assets/decks")
    custom_deck_paths = Dir["#{folder_path}/**/*.txt"].reject{|p| File.basename(p) == 'default.txt'}
    default_cards = File.read("#{folder_path}/default.txt").split("\n").map(&:upcase)

    custom_deck_paths.each do |custom_deck_path|
      file_name = custom_deck_path.split('/').last
      custom_cards = File.read(custom_deck_path).split("\n").map(&:upcase)
      dup_cards = default_cards & custom_cards

      if dup_cards.any?
        dups_found = true
        puts "#{file_name}: Following words already exist in default.txt"
        puts dup_cards
      end
    end

    puts "No dups found between decks" unless dups_found
  end
end
