Rails.application.routes.draw do
  root :to => 'lobby#index'
  get '/secretlobby', to: 'lobby#index'
  get '/:identifier', to: 'games#show'
  post '/:identifier', to: 'games#find_or_create'

  mount ActionCable.server, at: '/cable'
end
