/*! Shopeca MobileNavigation (0.0.1). (C) 2017 Tom Hnatovsky, Shopeca.com. BSD-3-Clause @license: https://opensource.org/licenses/BSD-3-Clause */

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
	sections: [],
	sectionPanels: [],
	sectionButtons: [],
	sectionNames: [],
	activeSection: null,
	init: function () {
		if (this.inited === false) {
			var $this = this;
			this.inited = true;
			this.initElements();
			this.button
				.on('click', function(e){
					e.preventDefault();
					$(this).toggleClass($this.settings.classNames.buttonActive);
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

		var $body = $('body');

		this.button
			.hide()
			.appendTo($body);

		this.wrapper
			.hide()
			.appendTo($body);
	},
	initContent: function () {
		if (this.initedContent === false) {
			this.initedContent = true;

			if (this.sections.length > 0) {
				var $this = this;
				var line = $(this.settings.templates.sectionButtonLine);
				for (var i = 0; i < this.sections.length; i++) {
					var panel = $(this.settings.templates.sectionPanel);
					panel
						.html(this.sections[i].clone())
						.appendTo(this.panel);
					this.sectionPanels.push(panel);

					var button = $(this.settings.templates.sectionButton);
					button
						.data('index', i)
						.appendTo(line)
						.text(this.sectionNames[i])
						.on('click', function(e){
							e.preventDefault();
							$this.switchSection($(this).data('index'));
						});
					this.sectionButtons.push(button);
				}
				line.appendTo(this.panel);
				$this.switchSection(0);
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
	addSection: function ($section, name) {
		this.sections.push($section);
		this.sectionNames.push(name);
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
		this.wrapper.show();
		this.panel
			.css('left', this.wrapper.width()+'px')
			.show()
			.animate({'left': 0}, 150);
	},
	close: function (quickClose) {
		this.active = false;
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
	switchSection: function (index) {
		if (typeof this.sectionButtons[index] !== 'undefined' && index !== this.activeSection) {
			for (var i = 0; i < this.sectionButtons.length; i++) {
				if (i == index) {
					this.activeSection = i;
					this.sectionPanels[i].addClass(this.settings.classNames.sectionActive);
					this.sectionButtons[i].addClass(this.settings.classNames.sectionButtonActive);
				} else {
					this.sectionPanels[i].removeClass(this.settings.classNames.sectionActive);
					this.sectionButtons[i].removeClass(this.settings.classNames.sectionButtonActive);
				}
			}
		}
	}
};
