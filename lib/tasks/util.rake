namespace :util do
  desc "Checks if there are any dups within each deck"
  task check_dups_within_decks: :environment do
    dups_found = false
    folder_path = Rails.root.join("app/assets/decks")
    deck_paths = Dir["#{folder_path}/*"]
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
  task check_dups_between_decks: :environment do
    dups_found = false

    folder_path = Rails.root.join("app/assets/decks")
    custom_deck_paths = Dir["#{folder_path}/*"].reject{|p| p.split('/').last == 'default.txt'}

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
