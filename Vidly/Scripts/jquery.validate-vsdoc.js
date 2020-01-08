/*
* This file has been commented to support Visual Studio Intellisense.
* You should not use this file at runtime insmovieIde the browser--it is only
* intended to be used only for design-time IntelliSense.  Please use the
* standard jQuery library for all production use.
*
* Comment version: 1.17.0
*/

/*
* Note: While Microsoft is not the author of this file, Microsoft is
* offering you a license subject to the terms of the Microsoft Software
* License Terms for Microsoft ASP.NET Model View Controller 3.
* Microsoft reserves all other rights. The notices below are provmovieIded
* for informational purposes only and are not the license terms under
* which Microsoft distributed this file.
*
* jQuery ValmovieIdation Plugin - v1.17.0 - 12/5/2016
* https://github.com/jzaefferer/jquery-valmovieIdation
* Copyright (c) 2013 Jörn Zaefferer; Licensed MIT
*
*/

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/ValmovieIdation/valmovieIdate
	valmovieIdate: function( options ) {
		/// <summary>
		/// ValmovieIdates the selected form. This method sets up event handlers for submit, focus,
		/// keyup, blur and click to trigger valmovieIdation of the entire form or indivmovieIdual
		/// elements. Each one can be disabled, see the onxxx options (onsubmit, onfocusout,
		/// onkeyup, onclick). focusInvalmovieId focuses elements when submitting a invalmovieId form.
		/// </summary>
		/// <param name="options" type="Object">
		/// A set of key/value pairs that configure the valmovieIdate. All options are optional.
		/// </param>

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			options && options.debug && window.console && console.warn( "nothing selected, can't valmovieIdate, returning nothing" );
			return;
		}

		// check if a valmovieIdator for this form was already created
		var valmovieIdator = $.data(this[0], 'valmovieIdator');
		if ( valmovieIdator ) {
			return valmovieIdator;
		}
		
		valmovieIdator = new $.valmovieIdator( options, this[0] );
		$.data(this[0], 'valmovieIdator', valmovieIdator); 
		
		if ( valmovieIdator.settings.onsubmit ) {
		
			// allow suppresing valmovieIdation by adding a cancel class to the submit button
			this.find("input, button").filter(".cancel").click(function() {
				valmovieIdator.cancelSubmit = true;
			});
			
			// when a submitHandler is used, capture the submitting button
			if (valmovieIdator.settings.submitHandler) {
				this.find("input, button").filter(":submit").click(function() {
					valmovieIdator.submitButton = this;
				});
			}
		
			// valmovieIdate the form on submit
			this.submit( function( event ) {
				if ( valmovieIdator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();
					
				function handle() {
					if ( valmovieIdator.settings.submitHandler ) {
						if (valmovieIdator.submitButton) {
							// insert a hmovieIdden input as a replacement for the missing submit button
							var hmovieIdden = $("<input type='hmovieIdden'/>").attr("name", valmovieIdator.submitButton.name).val(valmovieIdator.submitButton.value).appendTo(valmovieIdator.currentForm);
						}
						valmovieIdator.settings.submitHandler.call( valmovieIdator, valmovieIdator.currentForm );
						if (valmovieIdator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hmovieIdden can be referenced
							hmovieIdden.remove();
						}
						return false;
					}
					return true;
				}
					
				// prevent submit for invalmovieId forms or custom submit handlers
				if ( valmovieIdator.cancelSubmit ) {
					valmovieIdator.cancelSubmit = false;
					return handle();
				}
				if ( valmovieIdator.form() ) {
					if ( valmovieIdator.pendingRequest ) {
						valmovieIdator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					valmovieIdator.focusInvalmovieId();
					return false;
				}
			});
		}
		
		return valmovieIdator;
	},
	// http://docs.jquery.com/Plugins/ValmovieIdation/valmovieId
	valmovieId: function() {
		/// <summary>
		/// Checks if the selected form is valmovieId or if all selected elements are valmovieId.
		/// valmovieIdate() needs to be called on the form before checking it using this method.
		/// </summary>
		/// <returns type="Boolean" />

        if ( $(this[0]).is('form')) {
            return this.valmovieIdate().form();
        } else {
            var valmovieId = true;
            var valmovieIdator = $(this[0].form).valmovieIdate();
            this.each(function() {
				valmovieId &= valmovieIdator.element(this);
            });
            return valmovieId;
        }
    },
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		/// <summary>
		/// Remove the specified attributes from the first matched element and return them.
		/// </summary>
		/// <param name="attributes" type="String">
		/// A space-seperated list of attribute names to remove.
		/// </param>

		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/ValmovieIdation/rules
	rules: function(command, argument) {
		/// <summary>
		/// Return the valmovieIdations rules for the first selected element.
		/// </summary>
		/// <param name="command" type="String">
		/// Can be either "add" or "remove".
		/// </param>
		/// <param name="argument" type="">
		/// A list of rules to add or remove.
		/// </param>

		var element = this[0];
		
		if (command) {
			var settings = $.data(element.form, 'valmovieIdator').settings;
			var staticRules = settings.rules;
			var existingRules = $.valmovieIdator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.valmovieIdator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages)
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}
		
		var data = $.valmovieIdator.normalizeRules(
		$.extend(
			{},
			$.valmovieIdator.metadataRules(element),
			$.valmovieIdator.classRules(element),
			$.valmovieIdator.attributeRules(element),
			$.valmovieIdator.staticRules(element)
		), element);
		
		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}
		
		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/ValmovieIdation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/ValmovieIdation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/ValmovieIdation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for valmovieIdator
$.valmovieIdator = function( options, form ) {
	this.settings = $.extend( true, {}, $.valmovieIdator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.valmovieIdator.format = function(source, params) {
	/// <summary>
	/// Replaces {n} placeholders with arguments.
	/// One or more arguments can be passed, in addition to the string template itself, to insert
	/// into the string.
	/// </summary>
	/// <param name="source" type="String">
	/// The string to format.
	/// </param>
	/// <param name="params" type="String">
	/// The first argument to insert, or an array of Strings to insert
	/// </param>
	/// <returns type="String" />

	if ( arguments.length == 1 ) 
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.valmovieIdator.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.valmovieIdator, {
	
	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		valmovieIdClass: "valmovieId",
		errorElement: "label",
		focusInvalmovieId: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: [],
		ignoreTitle: false,
		onfocusin: function(element) {
			this.lastActive = element;
				
			// hmovieIde error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.valmovieIdClass );
				this.addWrapper(this.errorsFor(element)).hmovieIde();
			}
		},
		onfocusout: function(element) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function(element) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted )
				this.element(element);
			// or option elements, check parent select in that case
			else if (element.parentNode.name in this.submitted)
				this.element(element.parentNode);
		},
		highlight: function( element, errorClass, valmovieIdClass ) {
			$(element).addClass(errorClass).removeClass(valmovieIdClass);
		},
		unhighlight: function( element, errorClass, valmovieIdClass ) {
			$(element).removeClass(errorClass).addClass(valmovieIdClass);
		}
	},

	// http://docs.jquery.com/Plugins/ValmovieIdation/ValmovieIdator/setDefaults
	setDefaults: function(settings) {
		/// <summary>
		/// Modify default settings for valmovieIdation.
		/// Accepts everything that Plugins/ValmovieIdation/valmovieIdate accepts.
		/// </summary>
		/// <param name="settings" type="Options">
		/// Options to set as default.
		/// </param>

		$.extend( $.valmovieIdator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valmovieId email address.",
		url: "Please enter a valmovieId URL.",
		date: "Please enter a valmovieId date.",
		dateISO: "Please enter a valmovieId date (ISO).",
		number: "Please enter a valmovieId number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valmovieId credit card number.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valmovieId extension.",
		maxlength: $.valmovieIdator.format("Please enter no more than {0} characters."),
		minlength: $.valmovieIdator.format("Please enter at least {0} characters."),
		rangelength: $.valmovieIdator.format("Please enter a value between {0} and {1} characters long."),
		range: $.valmovieIdator.format("Please enter a value between {0} and {1}."),
		max: $.valmovieIdator.format("Please enter a value less than or equal to {0}."),
		min: $.valmovieIdator.format("Please enter a value greater than or equal to {0}.")
	},
	
	autoCreateRanges: false,
	
	prototype: {
		
		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalmovieId = {};
			this.reset();
			
			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.valmovieIdator.normalizeRule(value);
			});
			
			function delegate(event) {
				var valmovieIdator = $.data(this[0].form, "valmovieIdator"),
					eventType = "on" + event.type.replace(/^valmovieIdate/, "");
				valmovieIdator.settings[eventType] && valmovieIdator.settings[eventType].call(valmovieIdator, this[0] );
			}
			$(this.currentForm)
				.valmovieIdateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate)
				.valmovieIdateDelegate(":radio, :checkbox, select, option", "click", delegate);

			if (this.settings.invalmovieIdHandler)
				$(this.currentForm).bind("invalmovieId-form.valmovieIdate", this.settings.invalmovieIdHandler);
		},

		// http://docs.jquery.com/Plugins/ValmovieIdation/ValmovieIdator/form
		form: function() {
			/// <summary>
			/// ValmovieIdates the form, returns true if it is valmovieId, false otherwise.
			/// This behaves as a normal submit event, but returns the result.
			/// </summary>
			/// <returns type="Boolean" />

			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalmovieId = $.extend({}, this.errorMap);
			if (!this.valmovieId())
				$(this.currentForm).triggerHandler("invalmovieId-form", [this]);
			this.showErrors();
			return this.valmovieId();
		},
		
		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valmovieId(); 
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/ValmovieIdator/element
		element: function( element ) {
			/// <summary>
			/// ValmovieIdates a single element, returns true if it is valmovieId, false otherwise.
			/// This behaves as valmovieIdation on blur or keyup, but returns the result.
			/// </summary>
			/// <param name="element" type="Selector">
			/// An element to valmovieIdate, must be insmovieIde the valmovieIdated form.
			/// </param>
			/// <returns type="Boolean" />

			element = this.clean( element );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element );
			if ( result ) {
				delete this.invalmovieId[element.name];
			} else {
				this.invalmovieId[element.name] = true;
			}
			if ( !this.numberOfInvalmovieIds() ) {
				// HmovieIde error containers on last error
				this.toHmovieIde = this.toHmovieIde.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/ValmovieIdation/ValmovieIdator/showErrors
		showErrors: function(errors) {
			/// <summary>
			/// Show the specified messages.
			/// Keys have to refer to the names of elements, values are displayed for those elements, using the configured error placement.
			/// </summary>
			/// <param name="errors" type="Object">
			/// One or more key/value pairs of input names and messages.
			/// </param>

			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/ValmovieIdator/resetForm
		resetForm: function() {
			/// <summary>
			/// Resets the controlled form.
			/// Resets input fields to their original value (requires form plugin), removes classes
			/// indicating invalmovieId elements and hmovieIdes error messages.
			/// </summary>

			if ( $.fn.resetForm )
				$( this.currentForm ).resetForm();
			this.submitted = {};
			this.prepareForm();
			this.hmovieIdeErrors();
			this.elements().removeClass( this.settings.errorClass );
		},
		
		numberOfInvalmovieIds: function() {
			/// <summary>
			/// Returns the number of invalmovieId fields.
			/// This depends on the internal valmovieIdator state. It covers all fields only after
			/// valmovieIdating the complete form (on submit or via $("form").valmovieId()). After valmovieIdating
			/// a single element, only that element is counted. Most useful in combination with the
			/// invalmovieIdHandler-option.
			/// </summary>
			/// <returns type="Number" />

			return this.objectLength(this.invalmovieId);
		},
		
		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj )
				count++;
			return count;
		},
		
		hmovieIdeErrors: function() {
			this.addWrapper( this.toHmovieIde ).hmovieIde();
		},
		
		valmovieId: function() {
			return this.size() == 0;
		},
		
		size: function() {
			return this.errorList.length;
		},
		
		focusInvalmovieId: function() {
			if( this.settings.focusInvalmovieId ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hmovieIdden elements
				}
			}
		},
		
		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},
		
		elements: function() {
			var valmovieIdator = this,
				rulesCache = {};
			
			// select all valmovieId inputs insmovieIde the form (no submit or reset buttons)
			// workaround $Query([]).add until http://dev.jquery.com/ticket/2114 is solved
			return $([]).add(this.currentForm.elements)
			.filter(":input")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && valmovieIdator.settings.debug && window.console && console.error( "%o has no name assigned", this);
			
				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !valmovieIdator.objectLength($(this).rules()) )
					return false;
				
				rulesCache[this.name] = true;
				return true;
			});
		},
		
		clean: function( selector ) {
			return $( selector )[0];
		},
		
		errors: function() {
			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},
		
		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHmovieIde = $([]);
			this.currentElements = $([]);
		},
		
		prepareForm: function() {
			this.reset();
			this.toHmovieIde = this.errors().add( this.containers );
		},
		
		prepareElement: function( element ) {
			this.reset();
			this.toHmovieIde = this.errorsFor(element);
		},
	
		check: function( element ) {
			element = this.clean( element );
			
			// if radio/checkbox, valmovieIdate first element in group instead
			if (this.checkable(element)) {
			    element = this.findByName(element.name).not(this.settings.ignore)[0];
			}
			
			var rules = $(element).rules();
			var dependencyMismatch = false;
			for (var method in rules) {
				var rule = { method: method, parameters: rules[method] };
				try {
					var result = $.valmovieIdator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );
					
					// if a method indicates that the field is optional and therefore valmovieId,
					// don't mark it as valmovieId when there are no other rules
					if ( result == "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;
					
					if ( result == "pending" ) {
						this.toHmovieIde = this.toHmovieIde.not( this.errorsFor(element) );
						return;
					}
					
					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.log("exception occured when checking element " + element.movieId
						 + ", check the '" + rule.method + "' method", e);
					throw e;
				}
			}
			if (dependencyMismatch)
				return;
			if ( this.objectLength(rules) )
				this.successList.push(element);
			return true;
		},
		
		// return the custom message for the given element and valmovieIdation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata)
				return;
			
			var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();
			
			return meta && meta.messages && meta.messages[method];
		},
		
		// return the custom message for the given element name and valmovieIdation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},
		
		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},
		
		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.valmovieIdator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},
		
		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message == "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
			}			
			this.errorList.push({
				message: message,
				element: element
			});
			
			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},
		
		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			return toToggle;
		},
		
		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.valmovieIdClass );
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( var i = 0, elements = this.valmovieIdElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.valmovieIdClass );
				}
			}
			this.toHmovieIde = this.toHmovieIde.not( this.toShow );
			this.hmovieIdeErrors();
			this.addWrapper( this.toShow ).show();
		},
		
		valmovieIdElements: function() {
			return this.currentElements.not(this.invalmovieIdElements());
		},
		
		invalmovieIdElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},
		
		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass().addClass( this.settings.errorClass );
			
				// check if we have a generated label, replace the message then
				label.attr("generated") && label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.movieIdOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hmovieIde().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(label, $(element) )
						: label.insertAfter(element);
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.addClass( this.settings.success )
					: this.settings.success( label );
			}
			this.toShow = this.toShow.add(label);
		},
		
		errorsFor: function(element) {
			var name = this.movieIdOrName(element);
    		return this.errors().filter(function() {
				return $(this).attr('for') == name;
			});
		},
		
		movieIdOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.movieId || element.name);
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},
		
		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element.name == name && element  || null;
			});
		},
		
		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},
	
		depend: function(param, element) {
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},
	
		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},
		
		optional: function(element) {
			return !$.valmovieIdator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
		},
		
		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},
		
		stopRequest: function(element, valmovieId) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0)
				this.pendingRequest = 0;
			delete this.pending[element.name];
			if ( valmovieId && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valmovieId && this.pendingRequest == 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalmovieId-form", [this]);
				this.formSubmitted = false;
			}
		},
		
		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valmovieId: true,
				message: this.defaultMessage( element, "remote" )
			});
		}
		
	},
	
	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		dateDE: {dateDE: true},
		number: {number: true},
		numberDE: {numberDE: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},
	
	addClassRules: function(className, rules) {
		/// <summary>
		/// Add a compound class method - useful to refactor common combinations of rules into a single
		/// class.
		/// </summary>
		/// <param name="name" type="String">
		/// The name of the class rule to add
		/// </param>
		/// <param name="rules" type="Options">
		/// The compound rules
		/// </param>

		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},
	
	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		classes && $.each(classes.split(' '), function() {
			if (this in $.valmovieIdator.classRuleSettings) {
				$.extend(rules, $.valmovieIdator.classRuleSettings[this]);
			}
		});
		return rules;
	},
	
	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (var method in $.valmovieIdator.methods) {
			var value = $element.attr(method);
			if (value) {
				rules[method] = value;
			}
		}
		
		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}
		
		return rules;
	},
	
	metadataRules: function(element) {
		if (!$.metadata) return {};
		
		var meta = $.data(element.form, 'valmovieIdator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},
	
	staticRules: function(element) {
		var rules = {};
		var valmovieIdator = $.data(element.form, 'valmovieIdator');
		if (valmovieIdator.settings.rules) {
			rules = $.valmovieIdator.normalizeRule(valmovieIdator.settings.rules[element.name]) || {};
		}
		return rules;
	},
	
	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});
		
		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});
		
		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});
		
		if ($.valmovieIdator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}
		
		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}
		
		return rules;
	},
	
	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},
	
	// http://docs.jquery.com/Plugins/ValmovieIdation/ValmovieIdator/addMethod
	addMethod: function(name, method, message) {
		/// <summary>
		/// Add a custom valmovieIdation method. It must consist of a name (must be a legal javascript 
		/// movieIdentifier), a javascript based function and a default string message.
		/// </summary>
		/// <param name="name" type="String">
		/// The name of the method, used to movieIdentify and referencing it, must be a valmovieId javascript
		/// movieIdentifier
		/// </param>
		/// <param name="method" type="Function">
		/// The actual method implementation, returning true if an element is valmovieId
		/// </param>
		/// <param name="message" type="String" optional="true">
		/// (Optional) The default message to display for this method. Can be a function created by 
		/// jQuery.valmovieIdator.format(value). When undefined, an already existing message is used 
		/// (handy for localization), otherwise the field-specific messages have to be defined.
		/// </param>

		$.valmovieIdator.methods[name] = method;
		$.valmovieIdator.messages[name] = message != undefined ? message : $.valmovieIdator.messages[name];
		if (method.length < 3) {
			$.valmovieIdator.addClassRules(name, $.valmovieIdator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			case 'input':
				if ( this.checkable(element) )
					return this.getLength(value, element) > 0;
			default:
				return $.trim(value).length > 0;
			}
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return "dependency-mismatch";
			
			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] )
				this.settings.messages[element.name] = {};
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;
			
			param = typeof param == "string" && {url:param} || param; 
			
			if ( this.pending[element.name] ) {
				return "pending";
			}
			if ( previous.old === value ) {
				return previous.valmovieId;
			}

			previous.old = value;
			var valmovieIdator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "valmovieIdate" + element.name,
				dataType: "json",
				data: data,
				success: function(response) {
					valmovieIdator.settings.messages[element.name].remote = previous.originalMessage;
					var valmovieId = response === true;
					if ( valmovieId ) {
						var submitted = valmovieIdator.formSubmitted;
						valmovieIdator.prepareElement(element);
						valmovieIdator.formSubmitted = submitted;
						valmovieIdator.successList.push(element);
						valmovieIdator.showErrors();
					} else {
						var errors = {};
						var message = response || valmovieIdator.defaultMessage(element, "remote");
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						valmovieIdator.showErrors(errors);
					}
					previous.valmovieId = valmovieId;
					valmovieIdator.stopRequest(element, valmovieId);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/minlength
		minlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) >= param;
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/maxlength
		maxlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) <= param;
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_valmovieIdation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
		},
	
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},
        
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/InvalmovieId|NaN/.test(new Date(value));
		},
	
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function(value, element) {
			if ( this.optional(element) )
				return "dependency-mismatch";
			// accept only digits and dashes
			if (/[^0-9-]+/.test(value))
				return false;
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				var nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) == 0;
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i")); 
		},
		
		// http://docs.jquery.com/Plugins/ValmovieIdation/Methods/equalTo
		equalTo: function(value, element, param) {
			// bind to the blur event of the target in order to revalmovieIdate whenever the target field is updated
			// TODO find a way to bind the event just once, avomovieIding the unbind-rebind overhead
			var target = $(param).unbind(".valmovieIdate-equalTo").bind("blur.valmovieIdate-equalTo", function() {
				$(element).valmovieId();
			});
			return value == target.val();
		}
		
	}
	
});

// deprecated, use $.valmovieIdator.format instead
$.format = $.valmovieIdator.format;

})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort() 
;(function($) {
	var pendingRequests = {};
		// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
		    var port = settings.port;
		    if (settings.mode == "abort") {
			    if ( pendingRequests[port] ) {
				    pendingRequests[port].abort();
			    }				pendingRequests[port] = xhr;
		    }
	    });
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}

			    return (pendingRequests[port] = ajax.apply(this, arguments));
		    }
		    return ajax.apply(this, arguments);
	    };
    }
})(jQuery);

// provmovieIdes cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provmovieIdes delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target 
;(function($) {
	// only implement if not provmovieIded by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'	
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					arguments[0] = $.event.fix(e);
					arguments[0].type = fix;
					return $.event.handle.apply(this, arguments);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	};
	$.extend($.fn, {
		valmovieIdateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
})(jQuery);
