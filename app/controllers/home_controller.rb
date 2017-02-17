class HomeController < ApplicationController
    def show
        render_component(no_prerender: true)
    end

end