# Deploying HyperLoop Showcase on HEROKU 

### INTRODUCTION

This tutorial is an attempt to achieve a complete working deployment of the **Hyperloop showcase** on a **HEROKU** Server.

The **Hyperloop showcase** has already been deployed successfully on a classic independant VPS (Rails 5.01, Capistrano and Passenger) :
[http://http://hyperloop-showcase.pixagency.com](http://hyperloop-showcase.pixagency.com)

### DEPLOYING TUTORIAL


#### Setup of a new HEROKU app

```
heroku login
git clone https://github.com/heroku/ruby-getting-started.git
cd ruby-getting-started
heroku create
git push heroku master
heroku open
```
The initial HEROKU app is coming with a Rails 4.x version. We are going to upgrade it to a Rails 5.0.1 version.

#### Upgrade to Rails 5.0.1

```
#Gemfile

		source 'https://rubygems.org'
		ruby '2.3.1'

		gem 'rails', '~> 5.0.1'
		gem 'puma', '3.6.2'
		gem "puma_worker_killer"
		gem 'sass-rails', '~> 5.0'
		gem 'uglifier', '>= 1.3.0'
		gem 'coffee-rails', '~> 4.2'
		gem 'pg', '0.18.4'
		gem 'jquery-rails'
		gem 'turbolinks', '~> 5'
		gem 'jbuilder', '~> 2.5'
		gem 'react-rails', '1.4.2'
		gem 'hyper-rails', '0.4.1'
		gem 'opal-rails', '0.9.1'
		gem 'opal-browser', '0.2.0'
		gem 'hyper-react', '0.11.0'
		gem 'hyper-router', '2.4.0'
		gem 'therubyracer', platforms: :ruby
		gem 'opal_hot_reloader', git: 'https://github.com/fkchang/opal-hot-reloader.git'
		gem 'foreman'

		group :development, :test do
		  gem 'byebug', platform: :mri
		end

		group :development do
		  gem 'web-console', '>= 3.3.0'
		  gem 'listen', '~> 3.0.5'
		  gem 'spring'
		  gem 'spring-watcher-listen', '~> 2.0.0'
		end

		gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```
```ruby
#config/environments/development.rb

		Rails.application.configure do
			    
			  config.cache_classes = false
			  config.eager_load = false 
			  config.consider_all_requests_local = true

			  if Rails.root.join('tmp/caching-dev.txt').exist?
			    config.action_controller.perform_caching = true

			    config.cache_store = :memory_store
			    config.public_file_server.headers = {
			      'Cache-Control' => 'public, max-age=172800'
			    }
			  else
			    config.action_controller.perform_caching = false

			    config.cache_store = :null_store
			  end
 
			  config.action_mailer.raise_delivery_errors = false
			  config.action_mailer.perform_caching = false
			  config.active_support.deprecation = :log
			  config.active_record.migration_error = :page_load		  
			  config.assets.debug = true
			  config.assets.quiet = true
			  config.file_watcher = ActiveSupport::EventedFileUpdateChecker
		end
```
```ruby
#config/environments/production.rb

		Rails.application.configure do
			  
			  config.cache_classes = true  
			  config.eager_load = true
			  config.consider_all_requests_local       = false
			  config.action_controller.perform_caching = true 
			  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?	 
			  config.assets.js_compressor = :uglifier			  
			  config.assets.compile = true			 
			  config.log_level = :debug			  
			  config.log_tags = [ :request_id ]			  
			  config.action_mailer.perform_caching = false		  
			  config.i18n.fallbacks = true		 
			  config.active_support.deprecation = :notify		 
			  config.log_formatter = ::Logger::Formatter.new		  

			  if ENV["RAILS_LOG_TO_STDOUT"].present?
			    logger           = ActiveSupport::Logger.new(STDOUT)
			    logger.formatter = config.log_formatter
			    config.logger = ActiveSupport::TaggedLogging.new(logger)
			  end
 
			  config.active_record.dump_schema_after_migration = false
		end
```
```
rm Gemfile.lock
bundle install
heroku local web
```
browse http://localhost:5000

```yml
#config/database.yml

	development:
	  <<: *default
	  database: ruby-getting-started_development
	  username: your-username
	  password: your-password
```
```
bundle exec rake db:create db:migrate
heroku local web
```
browse http://localhost:5000
```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```
```javascript
//app/assets/javascripts/application.js

		//= require 'components'
		//= require 'react_ujs'
		//= require 'jquery'
		//= require 'jquery_ujs'

		//= require 'turbolinks'
		//= require_tree .

		Opal.load('components');
```
```ruby
#app/views/components.rb

		require 'opal'
		require 'hyper-react'
		require 'react/react-source'
		require 'reactrb/auto-import'
		if React::IsomorphicHelpers.on_opal_client?
		  require 'opal-jquery'
		  require 'browser'
		  require 'browser/interval'
		  require 'browser/delay'
		  # add any additional requires that can ONLY run on client here
		end

		require_tree './components'
```
```
rails g hyperloop:component Home::Show
```
```
heroku local web
```
browse http://localhost:5000
```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```
```ruby
#config/routes.rb

		root 'home#show'
```
```ruby
#app/controllers/home_controller.rb

		class HomeController < ApplicationController
		    def show
			render_component
		    end
		end
```
```
heroku local web
```
browse http://localhost:5000
```
git add .
git commit -m "Demo"
git push heroku master
heroku open

```
2017-02-17T11:36:20.452380+00:00 heroku[web.1]: Process running mem=708M(138.3%)
2017-02-17T11:36:20.452461+00:00 heroku[web.1]: Error R14 (Memory quota exceeded)
2017-02-17T11:36:42.220977+00:00 heroku[web.1]: Process running mem=772M(150.8%)
2017-02-17T11:36:42.221193+00:00 heroku[web.1]: Error R14 (Memory quota exceeded)
2017-02-17T11:36:43.578328+00:00 heroku[router]: at=error code=H12 desc="Request timeout" method=GET path="/" host=damp-harbor-10403.herokuapp.com request_id=6f69fef0-f657-4134-8097-bcd9b422a0a8 fwd="109.51.219.142" dyno=web.1 connect=1ms service=30000ms status=503 bytes=0
2017-02-17T11:36:45.165809+00:00 app[web.1]: [4] ! Terminating timed out worker: 6

```