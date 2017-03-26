/*! Shopeca MobileNavigation (0.0.1). (C) 2017 Tom Hnatovsky, Shopeca.com. BSD-3-Clause @license: https://opensource.org/licenses/BSD-3-Clause */

;var Shopeca = Shopeca || {}; Shopeca.MobileNavigation = {
	inited: false,
	initedContent: false,
	active: false,
	button: null,
	buttonTemplate: '<button class="mobile-navigation-button hamburger hamburger--squeeze" type="button"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>',
	panel: null,
	panelTemplate: '<div class="mobile-navigation-panel"></div>',
	wrapper: null,
	wrapperTemplate: '<div class="mobile-navigation-wrapper"></div>',
	heading: null,
	headingTemplate: '<div class="mobile-navigation-heading"></div>',
	settings: {},
	sections: [],
	sectionPanels: [],
	sectionPanelTemplate: '<div class="mobile-navigation-section"></div>',
	sectionButtonTemplate: '<button></button>',
	sectionButtonLineTemplate: '<div class="mobile-navigation-section-buttons"></div>',
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
					$(this).toggleClass('is-active');
					$this.toggle();
				})
		}
	},
	initElements: function () {
		this.button = $(this.buttonTemplate);
		this.wrapper = $(this.wrapperTemplate);
		this.panel = $(this.panelTemplate);
		this.panel.appendTo(this.wrapper);

		this.heading = $(this.headingTemplate);
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
				var line = $(this.sectionButtonLineTemplate);
				for (var i = 0; i < this.sections.length; i++) {
					var panel = $(this.sectionPanelTemplate);
					panel
						.html(this.sections[i].clone())
						.appendTo(this.panel);
					this.sectionPanels.push(panel);

					var button = $(this.sectionButtonTemplate);
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
		this.settings = settings;
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
			.removeClass('is-active')
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
		if (typeof this.sectionButtons[index] != 'undefined' && index !== this.activeSection) {
			for (var i = 0; i < this.sectionButtons.length; i++) {
				if (i == index) {
					this.activeSection = i;
					this.sectionPanels[i].addClass('active');
					this.sectionButtons[i].addClass('active');
				} else {
					this.sectionPanels[i].removeClass('active');
					this.sectionButtons[i].removeClass('active');
				}
			}
		}
	}
};
