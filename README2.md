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
git add .
git commit -m "Demo"
git push heroku master
heroku open

```