# Create decks from text files
public_folder_path = Rails.root.join("app/assets/decks")
private_folder_path = Rails.root.join("app/assets/decks/private")

public_deck_paths = Dir["#{public_folder_path}/*.txt"]
private_deck_paths = Dir["#{private_folder_path}/*.txt"]

public_deck_paths.concat(private_deck_paths).each do |deck_path|
  is_private = deck_path.split('/')[-2] == 'private'
  Deck.find_or_create_by!({
    name: File.basename(deck_path, File.extname(deck_path)), # returns base name w/o file extension
    is_private: is_private
  })
end
