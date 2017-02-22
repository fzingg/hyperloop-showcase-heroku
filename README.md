# Deploying the Hyperloop Showcase App on Heroku (Debug way)

## Preamble

This tutorial is the third in a series of four:

+ Chapter 1: [Hyperloop Showcase](https://github.com/fzingg/hyperloop-showcase) 
+ Chapter 2: [Hyperloop Showcase Template](https://github.com/fzingg/hyperloop-showcase-template) 
+ Chapter 3: [Hyperloop Showcase with Heroku (Debug way)](https://github.com/fzingg/hyperloop-showcase-heroku) 
+ Chapter 4: [Hyperloop Showcase with Heroku (Fast way)](https://github.com/fzingg/hyperloop-showcase-template-heroku) 

For more information: [HyperLoop Web site](http://ruby-hyperloop.io/)

## INTRODUCTION

This tutorial is a very detailed list of commands and file modifications to achieve a working deployment of the **Hyperloop showcase** on a **Heroku** Server.

Of course the **Heroku** deployment could be faster, but this tutorial allows programmers to check step by step where an error could happen.

The live **Heroku** demo deployment is here : [https://damp-harbor-10403.herokuapp.com](https://damp-harbor-10403.herokuapp.com)

The **Hyperloop showcase** has already been deployed successfully on a classic independent VPS (Rails 5.01, Capistrano and Passenger) :
[http://http://hyperloop-showcase.pixagency.com](http://hyperloop-showcase.pixagency.com)


## DEPLOYING TUTORIAL


#### Set up a new Heroku app

```
heroku login
git clone https://github.com/heroku/ruby-getting-started.git
cd ruby-getting-started
heroku create
git push heroku master
heroku open
```
The initial Heroku app is coming with a Rails 4.x version. We are going to upgrade it to a Rails 5.0.1 version.

#### Upgrade to Rails 5.0.1

```
#Gemfile

		source 'https://rubygems.org'
		ruby '2.3.1'

		gem 'rails', '~> 5.0.1'
		gem 'puma', '3.7.0'
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
Browse to http://localhost:5000

#### Update database config file

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
Browse to http://localhost:5000

#### Push and test Heroku server
```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### Implement a React Component

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
```ruby
#config/routes.rb

		root 'home#show'
```
```ruby
#app/controllers/home_controller.rb

		class HomeController < ApplicationController
		    def show
		    end
		end
```
```ruby
#app/views/home/show.html.erb

<%= react_component 'Home::Show', {}, { prerender: false } %>
```
```
heroku local web
```
Browse to http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### HyperMesh Setup

```
#Gemfile

	gem 'hyper-mesh', '0.5.3'
```

```
bundle update
```

```
#app/views/components.rb

	require 'opal'

	require 'reactrb/auto-import'
	require 'react/react-source'
	require 'hyper-react'
	if React::IsomorphicHelpers.on_opal_client?
	  require 'opal-jquery'
	  require 'browser'
	  require 'browser/interval'
	  require 'browser/delay'
	  # add any additional requires that can ONLY run on client here
	end

	require 'hyper-mesh'
	require 'models'

	require_tree './components'
```

```
#config/application.rb
	...
	  class Application < Rails::Application
	    # Settings in config/environments/* take precedence over those specified here.
	    # Application configuration should go into files in config/initializers
	    # -- all .rb files in that directory are automatically loaded.
	    config.eager_load_paths += %W(#{config.root}/app/models/public)
	    config.autoload_paths += %W(#{config.root}/app/models/public)
	    config.assets.paths << ::Rails.root.join('app', 'models').to_s
	  end
	...
```

```
#routes.rb

mount HyperMesh::Engine => '/rr'
root 'home#show'
```

```
#app/models/models.rb

require_tree './public' if RUBY_ENGINE == 'opal'
```

```
#app/models/public/application_record.rb

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end
```

```
#app/policies/application_policy.rb

    # Policies regulate access to your public models
    # The following policy will open up full access (but only in development)
    # The policy system is very flexible and powerful.  See the documentation
    # for complete details.
    class ApplicationPolicy
      # Allow any session to connect:
      always_allow_connection
      # Send all attributes from all public models
      regulate_all_broadcasts { |policy| policy.send_all }
      # Allow all changes to public models
      allow_change(to: :all, on: [:create, :update, :destroy]) { true }
    end 
```

```
heroku local web
```
Browse to http://localhost:5000

#### Push and test Heroku server
```
git add .
git commit -m "Demo"
git push heroku master
heroku open

```

#### Webpack Setup

```
npm init
npm install webpack --save-dev
npm install webpack -g
```

```
#/.gitignore

/node_modules
```

```
// webpack.config.js

var path = require("path");

module.exports = {
    context: __dirname,
    entry: {
      client_only:  "./webpack/client_only.js",
      client_and_server: "./webpack/client_and_server.js"
    },
    output: {
      path: path.join(__dirname, 'app', 'assets',   'javascripts', 'webpack'),
      filename: "[name].js",
      publicPath: "/webpack/"
    },
    module: {
      loaders: [
        // add any loaders here
      ]
    },
    resolve: {
    modules: [
    path.join(__dirname, "src"),
    "node_modules"
    ]
    },
};
```

```javascript
// webpack/client_only.js

// any packages that depend specifically on the DOM go here
// for example the Webpack CSS loader generates code that will break prerendering
console.log('client_only.js loaded');
```

```javascript
// webpack/client_and_server.js

// all other packages that you can run on both server (prerendering) and client go here
// most well behaved packages can be required here
console.log('client_and_server.js loaded');
```

```
webpack
```

```javascript
// app/assets/javascripts/application.js

//= require 'components'
//= require 'react_ujs'
//= require 'jquery'
//= require 'jquery_ujs'
//= require 'webpack/client_only'
//= require 'turbolinks'
//= require_tree .

Opal.load('components');
```

```ruby
#app/views/components.rb

require 'opal'

require 'hyper-react'
require 'webpack/client_and_server.js'
require 'reactrb/auto-import'
if React::IsomorphicHelpers.on_opal_client?
  require 'opal-jquery'
  require 'browser'
  require 'browser/interval'
  require 'browser/delay'
  # add any additional requires that can ONLY run on client here
end

require 'hyper-mesh'
require 'models'

require_tree './components'
```

```
npm install react --save 
npm install react-dom --save

```

```javascript
// webpack/client_and_server.js

ReactDOM = require('react-dom')
React = require('react')
console.log('client_and_server.js loaded');
```

```
webpack
```

```
heroku local web
```

Browse to http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### ReactPlayer Component Config

```
npm install react-player --save
```

```javascript
//webpack/client_and_server.js

ReactDOM = require('react-dom')
React = require('react')
console.log('client_and_server.js loaded');
ReactPlayer = require('react-player')
```

```
webpack
```

```ruby
#app/views/components/home/show.rb

def render
  div do
    ReactPlayer(url:  'https://www.youtube.com/embed/FzCsDVfPQqk',
      playing: true
    )
  end
end
```

```
heroku local web
```

Browse to http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### React Bootstrap config

```
npm install bootstrap react-bootstrap --save
```

```javascript
//webpack/client_and_server.js

ReactDOM = require('react-dom')
React = require('react')
console.log('client_and_server.js loaded');
ReactPlayer = require('react-player')
ReactBootstrap = require('react-bootstrap')
```

```
webpack
```

```ruby
#app/views/components/home/show.rb

  def render
    ReactBootstrap::Button(bsStyle: 'success', bsSize: "small") do
      'Success'
    end.on(:click) do
      alert('you clicked me!')
    end
  end

```

```
heroku local web
```
Browse to http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### React BootstrapCSS setup

```
npm install css-loader file-loader style-loader url-loader --save-dev
```

```javascript
// webpack.config.js

var path = require("path");

module.exports = {
    context: __dirname,
    entry: {
      client_only:  "./webpack/client_only.js",
      client_and_server: "./webpack/client_and_server.js"
    },
    output: {
      path: path.join(__dirname, 'app', 'assets',   'javascripts', 'webpack'),
      filename: "[name].js",
      publicPath: "/webpack/"
    },
    module: {
      rules: [
      { test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
    },
    resolve: {
	modules: [
	path.join(__dirname, "src"),
	"node_modules"
	]
	},
};
```

```javascript
//webpack/client_only.js

require('bootstrap/dist/css/bootstrap.css');
```

```
npm install bootstrap --save
webpack
```

```ruby
#app/views/components/home/show.rb

module Components
  module Home
    class Show < React::Component::Base

      def say_hello(i)
        alert "Hello from number #{i}"
      end

      def render
        div do
          ReactBootstrap::Navbar(bsStyle: :inverse) do
            ReactBootstrap::Nav() do
              ReactBootstrap::NavbarBrand() do
                a(href: '#') { 'Hyperloop Showcase' }
              end
              ReactBootstrap::NavDropdown(
                eventKey: 1,
                title: 'Things',
                id: :drop_down
              ) do
                (1..5).each do |n|
                  ReactBootstrap::MenuItem(href: '#',
                    key: n,
                    eventKey: "1.#{n}"
                  ) do
                    "Number #{n}"
                  end.on(:click) { say_hello(n) }
                end
              end
            end
          end
          
        end
      end
    end
  end
end
```

```
heroku local web
```
Browse to http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### Bootswatch setup

```
npm install bootswatch
```

```javascript
// webpack/client_only.js

// any packages that depend specifically on the DOM go here
// for example the Webpack CSS loader generates code that will break prerendering
console.log('client_only.js loaded');
require('bootstrap/dist/css/bootstrap.css');
require('bootswatch/superhero/bootstrap.min.css');
```

```
webpack
```

```
heroku local web
```
Browse http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```

#### HyperMesh ActiveRecord model

```
rails g model Planevent
```

```ruby
# db/migrate/..create_planevents.rb

class CreatePlanevents < ActiveRecord::Migration[5.0]
  def change
    create_table :planevents do |t|
      t.string :planeventtitle
      t.text :description
      t.timestamps
    end
  end
end
````

```
rails db:migrate
mv app/models/planevent.rb app/models/public
mv app/models/application_record.rb app/models/public
heroku run rake --trace db:migrate
```

```ruby
# views/components/home/show.rb

module Components
  module Home
    class Show < React::Component::Base

      def say_hello(i)
        alert "Hello from number #{i}"
      end

      def render
        div do
          ReactBootstrap::Navbar(bsStyle: :inverse) do
            ReactBootstrap::Nav() do
              ReactBootstrap::NavbarBrand() do
                a(href: '') { 'HyperLoop Showcase' }
              end
              ReactBootstrap::NavDropdown(
                eventKey: 1,
                title: 'Things',
                id: :drop_down
              ) do
                (1..5).each do |n|
                  ReactBootstrap::MenuItem(href: '#',
                    key: n,
                    eventKey: "1.#{n}"
                  ) do
                    "Number #{n}"
                  end.on(:click) { say_hello(n) }
                end
              end
            end
          end
          div.container do
            
            PlaneventsList()
          end
        end
      end
    end
  end
end
```

```ruby
#app/views/components/home/planeventslist.rb

module Components
  module Home
    class PlaneventsList < React::Component::Base

      define_state new_planevent: Hash.new { |h, k| h[k] = '' }

      before_mount do
        # note that this will lazy load posts
        # and only the fields that are needed will be requested
        @planevents = Planevent.all
        @planevent_attributes = Hash[ 'planeventtitle' => 'Event Name', 'description' => 'Description']
      end

      def render
        div.container do
            div.row do
                new_planevent
            end

            hr

            div.row do
                table_render
            end

        end
      end

      def table_render

          div.col_md_12 do
            br
            table(class: "table table-hover") do
              thead do
                tr do
                  td.text_muted.small(width: '33%') { "NAME" }
                  td.text_muted.small(width: '33%') { "DESCRIPTION" }
                  td.text_muted.small(width: '33%') { "DATE" }
                end
              end
              tbody do
                @planevents.reverse.each do |planevent|
                  PlaneventsListItem(planevent: planevent)
                end
              end
            end
          end

      end

      def new_planevent

        @planevent_attributes.each do |attribute, value|

            ReactBootstrap::FormGroup() do

                ReactBootstrap::ControlLabel() do
                    value
                end
                ReactBootstrap::FormControl(
                    value: state.new_planevent[attribute],
                    type: :text,
                    ).on(:change) { |e|
                        state.new_planevent![attribute] = e.target.value
                    }
            end
         end

        ReactBootstrap::Button(bsStyle: :primary) do
          "Create an new event"
        end.on(:click) { save_new_planevent }

      end

      def save_new_planevent

        Planevent.create(state.new_planevent) do |result|
          # note that save is a promise so this code will only run after the save
          # yet react will move onto the code after this (before the save happens)
          alert "unable to save" unless result == true
        end
        state.new_planevent.clear

      end
    end

    class PlaneventsListItem < React::Component::Base
      param :planevent

      def render

        tr do
          td(width: '33%') { params.planevent.planeventtitle }
          td(width: '33%') { params.planevent.description }
          td(width: '33%') { params.planevent.created_at.to_s }
        end

      end

    end
  end
end
```

```
heroku local web
```

Browse to http://localhost:5000

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```
#### HyperMesh push notifications config

```ruby
#config/initializers/hyper_mesh.rb

HyperMesh.configuration do |config|
  config.transport = :simple_poller
end
```

```
heroku local web
```

Browse to http://localhost:5000 with 2 different browsers and add a new Event.  Both browsers should update the view with this new Event.

#### Push and test Heroku server

```
git add .
git commit -m "Demo"
git push heroku master
heroku open
```
