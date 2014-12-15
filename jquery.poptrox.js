/* jquery.poptrox.js v2.5.0 | (c) n33 | n33.co | MIT licensed */

(function($) {

	// Disables selection
		$.fn.poptrox_disableSelection = function() { return $(this).css('user-select', 'none').css('-khtml-user-select', 'none').css('-moz-user-select', 'none').css('-o-user-select', 'none').css('-webkit-user-select', 'none'); }

	// Poptrox prototype method
		$.fn.poptrox = function(options) {

			// Handle no elements.
				if (this.length == 0)
					return $(this);

			// Handle multiple elements.
				if (this.length > 1) {
				
					for (var i=0; i < this.length; i++)
						$(this[i]).poptrox(options);
					
					return $(this);
				
				}

			// Settings
				var settings = $.extend({

					preload:						false,						// If true, preload fullsize images in the background
					baseZIndex:						1000,						// Base Z-Index
					fadeSpeed:						300,						// Global fade speed
					overlayColor:					'#000000',					// Overlay color
					overlayOpacity:					0.6,						// Overlay opacity
					overlayClass:					'poptrox-overlay',			// Overlay class
					windowMargin:					50,							// Window margin size (in pixels; only comes into play when an image is larger than the viewport)
					windowHeightPad:				0,							// Window height pad
					selector:						'a',						// Anchor tag selector
					caption:						null,						// Caption settings (see docs)
					parent:							'body',						// Parent selector (ie. where all the popup/overlay stuff gets added).
					popupSpeed:						300,						// Popup (resize) speed
					popupWidth:						200,						// Popup width
					popupHeight:					100,						// Popup height
					popupIsFixed:					false,						// If true, popup won't resize to fit images
					useBodyOverflow:				false,						// If true, the BODY tag is set to overflow: hidden when the popup is visible
					usePopupEasyClose:				true,						// If true, popup can be closed by clicking on it anywhere
					usePopupForceClose:				false,						// If true, popup can be closed even while content is loading
					usePopupLoader:					true,						// If true, show the popup loader
					usePopupCloser:					true,						// If true, show the popup closer button/link
					usePopupCaption:				false,						// If true, show the popup image caption
					usePopupNav:					false,						// If true, show (and use) popup navigation
					usePopupDefaultStyling:			true,						// If true, default popup styling will be applied (background color, text color, etc)
					popupBackgroundColor:			'#FFFFFF',					// (Default Style) Popup background color (when usePopupStyling = true)
					popupTextColor:					'#000000',					// (Default Style) Popup text color (when usePopupStyling = true)
					popupLoaderTextSize:			'2em',						// (Default Style) Popup loader text size
					popupCloserBackgroundColor:		'#000000',					// (Default Style) Popup closer background color (when usePopupStyling = true)
					popupCloserTextColor:			'#FFFFFF',					// (Default Style) Popup closer text color (when usePopupStyling = true)
					popupCloserTextSize:			'20px',						// (Default Style) Popup closer text size
					popupPadding:					10,							// (Default Style) Popup padding (when usePopupStyling = true)
					popupCaptionHeight:				60,							// (Default Style) Popup height of caption area
					popupCaptionTextSize:			null,						// (Default Style) Popup caption text size
					popupBlankCaptionText:			'(untitled)',				// Applied to images that don't have captions (when captions are enabled)
					popupCloserText:				'&#215;',					// Popup closer text
					popupLoaderText:				'&bull;&bull;&bull;&bull;',	// Popup loader text
					popupClass:						'poptrox-popup',			// Popup class
					popupSelector:					null,						// (Advanced) Popup selector (use this if you want to replace the built-in popup)
					popupLoaderSelector:			'.loader',					// (Advanced) Popup Loader selector
					popupCloserSelector:			'.closer',					// (Advanced) Popup Closer selector
					popupCaptionSelector:			'.caption',					// (Advanced) Popup Caption selector
					popupNavPreviousSelector:		'.nav-previous',			// (Advanced) Popup Nav Previous selector
					popupNavNextSelector:			'.nav-next',				// (Advanced) Popup Nav Next selector
					onPopupClose:					null,						// Called when popup closes
					onPopupOpen:					null						// Called when popup opens

				}, options);
				
			// Variables

				var	$this = $(this),
					$body = $('body'),
					$overlay = $('<div class="' + settings.overlayClass +  '"></div>'),
					$window = $(window);
				
				var	windowWidth,
					windowHeight,
					navPos = 0,
					isLocked = false,
					cache = new Array();
				
				function updateWH() {

					windowWidth = $(window).width();
					windowHeight = $(window).height() + settings.windowHeightPad;

					var dw = Math.abs($popup.width() - $popup.outerWidth()), dh = Math.abs($popup.height() - $popup.outerHeight());
					var nw = $x.width(), nh = $x.height();
					var maxw = windowWidth - (settings.windowMargin * 2) - dw, maxh = windowHeight - (settings.windowMargin * 2) - dh;

					$popup
						.css('min-width', settings.popupWidth)
						.css('min-height', settings.popupHeight);

					$pic.children()
						.css('max-width', maxw)
						.css('max-height', maxh);

				}

				function getSlides() {
					return $(settings.selector, $this).not("[data-poptrox^='ignore']");
				}

				// Disable unused features
					if (!settings.usePopupLoader)
						settings.popupLoaderSelector = null;

					if (!settings.usePopupCloser)
						settings.popupCloserSelector = null;

					if (!settings.usePopupCaption)
						settings.popupCaptionSelector = null;

					if (!settings.usePopupNav) {

						settings.popupNavPreviousSelector = null;
						settings.popupNavNextSelector = null;

					}

				// Get popup
					var $popup;
				
					if (settings.popupSelector)
						$popup = $(settings.popupSelector);
					else
						$popup = $('<div class="' + settings.popupClass + '">' + (settings.popupLoaderSelector ? '<div class="loader">' + settings.popupLoaderText + '</div>' : '') + '<div class="pic"></div>' + (settings.popupCaptionSelector ? '<div class="caption"></div>' : '') + (settings.popupCloserSelector ? '<span class="closer">' + settings.popupCloserText + '</span>' : '') + (settings.popupNavPreviousSelector ? '<div class="nav-previous"></div>' : '') + (settings.popupNavNextSelector ? '<div class="nav-next"></div>' : '') + '</div>');

				// Get popup components
					var	$pic = $popup.find('.pic'),
						$x = $(),
						$loader = $popup.find(settings.popupLoaderSelector),
						$caption = $popup.find(settings.popupCaptionSelector),
						$closer = $popup.find(settings.popupCloserSelector),
						$nav_next = $popup.find(settings.popupNavNextSelector),
						$nav_previous = $popup.find(settings.popupNavPreviousSelector),
						$nav = $nav_next.add($nav_previous);

				// Apply default styling?
					if (settings.usePopupDefaultStyling) {
						
						$popup
							.css('background', settings.popupBackgroundColor)
							.css('color', settings.popupTextColor)
							.css('padding', settings.popupPadding + 'px');
							
						if ($caption.length > 0) {
							
							$popup
								.css('padding-bottom', settings.popupCaptionHeight + 'px');
							
							$caption
								.css('position', 'absolute')
								.css('left', '0')
								.css('bottom', '0')
								.css('width', '100%')
								.css('text-align', 'center')
								.css('height', settings.popupCaptionHeight + 'px')
								.css('line-height', settings.popupCaptionHeight + 'px');
								
							if (settings.popupCaptionTextSize)
								$caption.css('font-size', popupCaptionTextSize);
						
						}
							
						if ($closer.length > 0)
							$closer
								.html(settings.popupCloserText)
								.css('font-size', settings.popupCloserTextSize)
								.css('background', settings.popupCloserBackgroundColor)
								.css('color', settings.popupCloserTextColor)
								.css('display', 'block')
								.css('width', '40px')
								.css('height', '40px')
								.css('line-height', '40px')
								.css('text-align', 'center')
								.css('position', 'absolute')
								.css('text-decoration', 'none')
								.css('outline', '0')
								.css('top', '0')
								.css('right', '-40px');
								
						if ($loader.length > 0) {
							
							$loader
								.html('')
								.css('position', 'relative')
								.css('font-size', settings.popupLoaderTextSize)
								.on('startSpinning', function(e) {
									
									var x = $('<div>' + settings.popupLoaderText + '</div>');
									
									x
										.css('height', Math.floor(settings.popupHeight / 2) + 'px')
										.css('overflow', 'hidden')
										.css('line-height', Math.floor(settings.popupHeight / 2) + 'px')
										.css('text-align', 'center')
										.css('margin-top', Math.floor(($popup.height() - x.height() + ($caption.length > 0 ? $caption.height() : 0)) / 2))
										.css('color', (settings.popupTextColor ? settings.popupTextColor : ''))
										.on('xfin', function() { x.fadeTo(300, 0.5, function() { x.trigger('xfout'); }); })
										.on('xfout', function() { x.fadeTo(300, 0.05, function() { x.trigger('xfin'); }); })
										.trigger('xfin');
									
									$loader.append(x);
								
								})
								.on('stopSpinning', function(e) {
									
									var x = $loader.find('div');
									x.remove();
								
								});
						
						}
						
						if ($nav.length == 2) {
							
							$nav
								.css('font-size', '75px')
								.css('text-align', 'center')
								.css('color', '#fff')
								.css('text-shadow', 'none')
								.css('height', '100%')
								.css('position', 'absolute')
								.css('top', '0')
								.css('opacity', '0.35')
								.css('cursor', 'pointer')
								.css('box-shadow', 'inset 0px 0px 10px 0px rgba(0,0,0,0)')
								.poptrox_disableSelection();

							var wn, wp;

							if (settings.usePopupEasyClose) {
							
								wn = '100px';
								wp = '100px';
							
							}
							else {
								
								wn = '75%';
								wp = '25%';
							
							}
							
							$nav_next
								.css('right', '0')
								.css('width', wn)
								.html('<div style="position: absolute; height: 100px; width: 125px; top: 50%; right: 0; margin-top: -50px;">&gt;</div>');

							$nav_previous
								.css('left', '0')
								.css('width', wp)
								.html('<div style="position: absolute; height: 100px; width: 125px; top: 50%; left: 0; margin-top: -50px;">&lt;</div>');
						
						}
					
					}
			
			// Main
				$window
					.on('resize orientationchange', function() {
						updateWH();
					});

				$caption
					.on('update', function(e, s) {
						
						if (!s || s.length == 0)
							s = settings.popupBlankCaptionText;
						
						$caption.html(s);
					
					});
				
				$closer
					.css('cursor', 'pointer')
					.on('click', function(e) {
						
						e.preventDefault();
						e.stopPropagation();
					
						$popup.trigger('poptrox_close');
						
						return true;
					
					});

				$nav_next
					.on('click', function() {
						$popup.trigger('poptrox_next');
					});

				$nav_previous
					.on('click', function() {
						$popup.trigger('poptrox_previous');
					});

				$overlay
					.css('position', 'fixed')
					.css('left', 0)
					.css('top', 0)
					.css('z-index', settings.baseZIndex)
					.css('width', '100%')
					.css('height', '100%')
					.css('text-align', 'center')
					.css('cursor', 'pointer')
					.appendTo(settings.parent)
					.prepend('<div style="display:inline-block;height:100%;vertical-align:middle;"></div>')
					.append('<div style="position:absolute;left:0;top:0;width:100%;height:100%;background:' + settings.overlayColor + ';opacity:' + settings.overlayOpacity + ';filter:alpha(opacity=' + (settings.overlayOpacity * 100) + ');"></div>')
					.hide()
					.on('touchmove', function(e) {
						return false;
					})
					.on('click', function(e) {

						e.preventDefault();
						e.stopPropagation();

						$popup.trigger('poptrox_close');

					});
				
				if (settings.usePopupEasyClose) {

					$pic
						.css('cursor', 'pointer')
						.on('click', function(e) {

							e.preventDefault();
							e.stopPropagation();

							$popup.trigger('poptrox_close');

						});

				}

				$popup
					.css('display', 'inline-block')
					.css('vertical-align', 'middle')
					.css('position', 'relative')
					.css('z-index', 1)
					.appendTo($overlay)
					.hide()
					.on('poptrox_next', function(e) {
						
						var slides = getSlides(),
							x = navPos + 1;

						if (x >= slides.length)
							x = 0;
						
						
						return open(slides[x], e);
					})
					.on('poptrox_previous', function(e) {
					
						var slides = getSlides(),
							x = navPos - 1;
					
						if (x < 0)
							x = slides.length - 1;
					
						return open(slides[x], e);
					
					})
					.on('poptrox_reset', function() {
						
						updateWH();

						$popup
							.data('width', settings.popupWidth)
							.data('height', settings.popupHeight);

						$loader.hide().trigger('stopSpinning');
						$caption.hide();
						$closer.hide();
						$nav.hide();
						$pic.hide();
						$x.detach();
					
					})
					.on('poptrox_open', function(e, slide) {
					
						if (isLocked)
							return true;
					
						isLocked = true;
					
						if (settings.useBodyOverflow)
							$body.css('overflow', 'hidden');

						if (settings.onPopupOpen)
							(settings.onPopupOpen)();

						$overlay
							.fadeTo(settings.fadeSpeed, 1.0, function() {
								$popup.trigger('poptrox_switch', [slide, true]);
							});

					})
					.on('poptrox_switch', function(e, slide, ignoreLock) {
						
						var x, img;

						if (!ignoreLock && isLocked)
							return true;
						
						isLocked = true;

						$popup
							.css('width', $popup.data('width'))
							.css('height', $popup.data('height'));
							
						// Cleanup from previous
							$caption.hide();
							if ($x.attr('src'))
								$x.attr('src', '');
							$x.detach();
							
						// Activate new object
							x = slide;
							$x = x.object;
							$x.off('load');
						
							$pic
								.css('text-indent', '-9999px')
								.show()
								.append($x);

							if (x.type == 'ajax')
								$.get(x.src, function(data) {
									
									$x.html(data);
									$x.trigger('load');
								
								});
							else
								$x.attr('src', x.src);
							
							if (x.type != 'image')
								$x
									.css('position', 'relative')
									.css('outline', '0')
									.css('z-index', settings.baseZIndex + 100)
									.width(x.width)
									.height(x.height);

						// Initialize
							$loader.trigger('startSpinning').fadeIn(300);
							$popup.show();

						if (settings.popupIsFixed) {
							
							$popup
								.width(settings.popupWidth)
								.height(settings.popupHeight);

							$x.load(function() {
							
								$x.off('load');
								$loader.hide().trigger('stopSpinning');
								$caption.trigger('update', [x.captionText]).fadeIn(settings.fadeSpeed);
								$closer.fadeIn(settings.fadeSpeed);
								$pic.css('text-indent', 0).hide().fadeIn(settings.fadeSpeed, function() { isLocked = false; });
								navPos = x.index;
								$nav.fadeIn(settings.fadeSpeed);

							});
						
						}
						else {
							
							$x.load(function() {
								
								updateWH();

								$x.off('load');
								$loader.hide().trigger('stopSpinning');

								var	nw = $x.width(),
									nh = $x.height(),
									f = function() {

										$caption.trigger('update', [x.captionText]).fadeIn(settings.fadeSpeed);
										$closer.fadeIn(settings.fadeSpeed);
										$pic.css('text-indent', 0).hide().fadeIn(settings.fadeSpeed, function() { isLocked = false; });
										navPos = x.index;
										$nav.fadeIn(settings.fadeSpeed);

										$popup
											.data('width', nw)
											.data('height', nh)
											.css('width', 'auto')
											.css('height', 'auto');

									};
								
								if (nw == $popup.data('width')
								&&	nh == $popup.data('height'))
									(f)();
								else
									$popup.animate({ width: nw, height: nh }, settings.popupSpeed, 'swing', f);
										
							});
						
						}
						
						if (x.type != 'image')
							$x.trigger('load');
					
					})
					.on('poptrox_close', function() {
					
						if (isLocked
						&&	!settings.usePopupForceClose)
							return true;
					
						isLocked = true;
					
						$popup
							.hide()
							.trigger('poptrox_reset');
					
						if (settings.onPopupClose)
							(settings.onPopupClose)();
					
						$overlay
							.fadeOut(settings.fadeSpeed, function() {
							
								if (settings.useBodyOverflow)
									$body.css('overflow', 'auto');
									
								isLocked = false;
							
							});
					
					})
					.trigger('poptrox_reset');

				$window
					.keydown(function(e) {

						if ($popup.is(':visible')) {
							
							switch (e.keyCode) {
								
								case 37:
								case 32:
								
									if (settings.usePopupNav) {
										
										$popup.trigger('poptrox_previous');
										return false;
									
									}
									
									break;

								case 39:
									
									if (settings.usePopupNav) {
										
										$popup.trigger('poptrox_next');
										return false;
									
									}
									
									break;

								case 27:
									
									$popup.trigger('poptrox_close');
									return false;

									break;
							
							}
						
						}
					
					});
				
				var open = function (link, e) {

					link = $(link);

					var index = link.index(),
						img = link.find('img'),
						data = link.data('poptrox'),
						slide, tmp, caption;

					// No href? Bail.
						if (!link.attr('href'))
							return;

					slide = {
						index: 			index,
						link:			link,
						src:			link.attr('href'),
						captionText:	img.attr('title'),
						width:			link.attr('width'),
						height:			link.attr('height'),
						type:			null,
						object:			null
					};
					
					// Determine caption.
						
						// No caption setting? Use default (title attribute of image).
							if (!settings.caption)
								caption = img.attr('title');
						
						// Function?
							else if (typeof(settings.caption) == 'function')
								caption = (settings.caption)(a);
						
						// Selector?
							else if ('selector' in settings.caption) {
							
								var s = link.find(settings.caption.selector);
								
								if ('attribute' in settings.caption)
									caption = s.attr(settings.caption.attribute);
								else {
									
									caption = s.html();
									
									if (settings.caption.remove === true)
										s.remove();
								
								}

							}
					
						slide.captionText = caption;

					// If a data attribute exists, use it
						if (data) {
							
							var k, b = data.split(',');
							
							for (k in b) {
								
								tmp = b[k].match(/([0-9]+)x([0-9]+)/);
								
								// Size
									if (tmp && tmp.length == 3) {
										
										slide.width = tmp[1];
										slide.height = tmp[2];
									
									}
								// Type
									else
										slide.type = b[k];
						
							}
						
						}
						
					// No type? Attempt to guess it based on the href's domain
						if (!slide.type) {
							
							tmp = slide.src.match(/http[s]?:\/\/([a-z0-9\.]+)\/.*/);

							if (!tmp || tmp.length < 2)
								tmp = [false];

							switch (tmp[1]) {
								
								case 'api.soundcloud.com':
									slide.type = 'soundcloud';
									break;

								case 'youtu.be':
									slide.type = 'youtube';
									slide.width = 800;
									slide.height = 480;
									break;

								case 'vimeo.com':
									slide.type = 'vimeo';
									slide.width = 800;
									slide.height = 480;
									break;

								case 'wistia.net':
									slide.type = 'wistia';
									slide.width = 800;
									slide.height = 480;
									break;

								case 'bcove.me':
									slide.type = 'bcove';
									slide.width = 640;
									slide.height = 360;
									break;

								default:
									slide.type = 'image';
									break;
							
							}
						
						}
					
					// Create object (based on type)
						tmp = slide.src.match(/http([s]?):\/\/[a-z0-9\.]+\/(.*)/);

						if (tmp)
							slide.prefix = 'http' + (tmp[1] == 's' ? 's' : '');

						switch (slide.type) {
							
							case 'ignore':
								break;
						
							case 'iframe':
								slide.object = $('<iframe src="" frameborder="0"></iframe>');
								slide.object
									.on('click', function(e) { e.stopPropagation(); })
									.css('cursor', 'auto');
								
								break;
								
							case 'ajax':
								slide.object = $('<div class="poptrox-ajax"></div>');
								slide.object
									.on('click', function(e) { e.stopPropagation(); })
									.css('cursor', 'auto')
									.css('overflow', 'auto');
								
								break;
						
							case 'soundcloud':
								slide.object = $('<iframe scrolling="no" frameborder="no" src=""></iframe>');
								slide.src = slide.prefix + '://w.soundcloud.com/player/?url=' + escape(slide.src);
								slide.width = '600';
								slide.height = "166";
								
								break;

							case 'youtube':
								slide.object = $('<iframe src="" frameborder="0" allowfullscreen="1"></iframe>');
								slide.src = slide.prefix + '://www.youtube.com/embed/' + tmp[2];
								
								break;

							case 'vimeo':
								slide.object = $('<iframe src="" frameborder="0" allowFullScreen="1"></iframe>');
								slide.src = slide.prefix + '://player.vimeo.com/video/' + tmp[2];
								
								break;

							case 'wistia':
								slide.object = $('<iframe src="" frameborder="0" allowFullScreen="1"></iframe>');
								slide.src = slide.prefix + '://fast.wistia.net/' + tmp[2];
								
								break;

							case 'bcove':
								slide.object = $('<iframe src="" frameborder="0" allowFullScreen="1" width="100%"></iframe>');
								slide.src = slide.prefix + '://bcove.me/' + tmp[2];
								
								break;

							default:
								slide.object = $('<img src="" alt="" style="vertical-align:bottom" />');
								
								// todo: fix preloading
								/*
								if (settings.preload) {
									
									var tmp = document.createElement('img');
									tmp.src = slide.src; cache.push(tmp);
								
								}
								*/
								
								break;
						
						}

					if (slide.type != 'ignore') {
						link.css('outline', 0);
						e.preventDefault();
						e.stopPropagation();
						$popup.trigger('poptrox_open', [slide]);
					}

				}

				$this.delegate(settings.selector, 'click', function (e) {
					open(this, e);
				});
				
			return $(this);
		
		};

})(jQuery);