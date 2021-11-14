Rails.application.routes.draw do
  scope '/api/v1' do
    resources :todos do
      get :filterByStatus, on: :collection 
    end
  end
end
