class Game < ApplicationRecord
  validates :identifier, presence: true, uniqueness: true
  validates :status, 
    presence: true,  
    inclusion: { in: %w(active inactive), message: "%{value} is not a valid status" }
  validates :state, presence: true
end
