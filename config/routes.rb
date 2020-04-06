Rails.application.routes.draw do
  root :to => 'home#index'
  
  post '/:identifier', to: 'games#find_or_create'

  match '*path', to: 'home#index', via: :all
  mount ActionCable.server, at: '/cable'
end
