Rails.application.routes.draw do
  root :to => 'lobby#index'
  get '/secretlobby', to: 'lobby#index'
  get '/:identifier', to: 'lobby#index'

  mount ActionCable.server, at: '/cable'
end
