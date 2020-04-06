Rails.application.routes.draw do
  root :to => 'home#index'
  
  namespace :api, defaults: { format: 'json' } do
    get  '/:identifier', to: 'games#show'
    post '/:identifier', to: 'games#find_or_create'
  end

  match '*path', to: 'home#index', via: :all
  mount ActionCable.server, at: '/cable'
end
