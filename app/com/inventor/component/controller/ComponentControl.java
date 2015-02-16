package com.inventor.component.controller;

import play.mvc.Controller;
import play.mvc.Result;

public class ComponentControl extends Controller {
      
	
    public static Result form() {
        return ok(views.html.component.form.render());
    }
}
