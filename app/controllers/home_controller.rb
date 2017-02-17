class HomeController < ApplicationController
    def show
        render_component 'Home::Show', {}, { prerender: false } 
    end

end