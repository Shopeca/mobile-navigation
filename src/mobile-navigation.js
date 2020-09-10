/*! Shopeca MobileNavigation (0.1.0). (C) 2020 Tom Hnatovsky, Shopeca.com. BSD-3-Clause @license: https://opensource.org/licenses/BSD-3-Clause */

;var Shopeca = Shopeca || {}; Shopeca.MobileNavigation = {
	settings: {
		templates: {
			button: '<button class="mobile-navigation-button"></button>',
			panel: '<div class="mobile-navigation-panel"></div>',
			wrapper: '<div class="mobile-navigation-wrapper"></div>',
			heading: '<div class="mobile-navigation-heading"></div>',
			sectionPanel: '<div class="mobile-navigation-section"></div>',
			sectionButton: '<button></button>',
			sectionButtonLine: '<div class="mobile-navigation-section-buttons"></div>'
		},
		classNames: {
			buttonActive: 'active',
			sectionActive: 'active',
			sectionButtonActive: 'active'
		}
	},
	inited: false,
	initedContent: false,
	active: false,
	button: null,
	panel: null,
	wrapper: null,
	heading: null,
	sections: {},
	activeSection: null,
	body: null,
	init: function () {
		if (this.inited === false) {
			var $this = this;
			this.body = $('body');
			this.inited = true;
			this.initElements();
			this.button
				.on('click', function(e){
					e.preventDefault();
					$this.toggle();
				})
		}
	},
	initElements: function () {
		this.button = $(this.settings.templates.button);
		this.wrapper = $(this.settings.templates.wrapper);
		this.panel = $(this.settings.templates.panel);
		this.panel.appendTo(this.wrapper);

		this.heading = $(this.settings.templates.heading);
		this.heading.appendTo(this.panel);
		if ('heading' in this.settings) {
			this.heading.html(this.settings.heading);
		}

		this.button
			.hide()
			.appendTo(this.body);

		this.wrapper
			.hide()
			.appendTo(this.body);
	},
	initContent: function () {
		if (this.initedContent === false) {
			this.initedContent = true;

			var sectionKeys = Object.keys(this.sections);
			if (sectionKeys.length > 0) {
				var $this = this;
				var line = $(this.settings.templates.sectionButtonLine);
				for (var i = 0; i < sectionKeys.length; i++) {
					var settings = this.sections[sectionKeys[i]];
					var panel = $(this.settings.templates.sectionPanel);
					panel
						.html(settings.element.clone())
						.appendTo(this.panel);
					if (typeof settings.heading == 'string') {
						panel.prepend($(settings.heading));
					}
					this.sections[sectionKeys[i]].panel = panel;

					var button = $(this.settings.templates.sectionButton);
					button
						.data('index', sectionKeys[i])
						.appendTo(line)
						.text(settings.name)
						.on('click', function(e){
							e.preventDefault();
							$this.switchSection($(this).data('index'));
						});
					this.sections[sectionKeys[i]].button = button;
				}
				line.appendTo(this.panel);
				$this.switchSection(sectionKeys[0]);
			}
		}
	},
	configure: function (settings) {
		this.settings = $.extend(true, this.settings, settings);
		if ('jRes' in this.settings && 'breakpoint' in this.settings) {
			var $this = this;
			this.settings.jRes.addFunc({
				breakpoint: this.settings.breakpoint,
				enter: function() {
					$this.show();
				}, exit: function() {
					$this.hide();
				}
			});
		}
	},
	addSection: function (key, section) {
		if (typeof section.element == 'undefined') {
			console.error('You have to define element for your mobile navigation section');
			return;
		}
		if (typeof section.name == 'undefined') {
			console.error('You have to define name for your mobile navigation section');
			return;
		}

		this.sections[key] = section;
	},
	show: function () {
		this.init();
		this.button.show();
	},
	hide: function () {
		this.init();
		this.close(true);
		this.button
			.removeClass(this.settings.classNames.buttonActive)
			.hide();
	},

	toggle: function () {
		if (this.active) {
			this.close();
		} else {
			this.open();
		}
	},
	open: function () {
		this.initContent();
		this.active = true;
		this.button.addClass(this.settings.classNames.buttonActive);
		this.body.css('overflow', 'hidden');
		this.wrapper.show();
		this.panel
			.css('left', this.wrapper.width()+'px')
			.show()
			.animate({'left': 0}, 150);
	},
	close: function (quickClose) {
		this.active = false;
		this.button.removeClass(this.settings.classNames.buttonActive);
		this.body.css('overflow', 'auto');
		if (quickClose === true) {
			this.wrapper.hide();
		} else {
			var $this = this;
			this.panel.animate({'left': this.wrapper.width()+'px'}, 100, function(){
				$this.wrapper.hide();
				$this.panel.hide();
			});
		}
	},
	getSection: function (index) {
		if (typeof this.sections[index] !== 'undefined') {
			return this.sections[index];
		}
		return null;
	},
	switchSection: function (index) {
		var section = this.getSection(index);
		if (section !== null && index !== this.activeSection) {
			var sectionKeys = Object.keys(this.sections);
			if (sectionKeys.length > 0) {
				for (var i = 0; i < sectionKeys.length; i++) {
					var key = sectionKeys[i];
					var panel = this.sections[key].panel;
					var button = this.sections[key].button;
					if (index == key) {
						this.activeSection = key;
						panel.addClass(this.settings.classNames.sectionActive);
						if (panel.data('initialized') != true) {
							panel.data('initialized', true);
							if (typeof this.sections[key].initialize == 'function') {
								this.sections[key].initialize(panel);
							}
						}
						button.addClass(this.settings.classNames.sectionButtonActive);
					} else {
						panel.removeClass(this.settings.classNames.sectionActive);
						button.removeClass(this.settings.classNames.sectionButtonActive);
					}
				}
			}
		}
	}
};
