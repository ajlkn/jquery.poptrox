# A lightbox gallery plugin for jQuery

Adds lightbox galleries to jQuery. Heavily customizable, easy to use, and built to
support images, videos (YouTube, Vimeo, Wistia, Brightcove), Soundcloud tracks, IFRAMEs, and AJAX content.

Requires jQuery 1.7+.

## Usage

Load it after jQuery:

```html
<script src="http://code.jquery.com/jquery-x.x.x.min.js"></script>
<script src="jquery.poptrox.min.js"></script>
```

Set up your gallery:

```html
<div id="gallery">
	<a href="path/to/image1.jpg"><img src="path/to/image1_thumbnail.jpg" /></a>
	<a href="path/to/image2.jpg"><img src="path/to/image2_thumbnail.jpg" /></a>
	<a href="path/to/image3.jpg"><img src="path/to/image3_thumbnail.jpg" /></a>
	<a href="path/to/image4.jpg"><img src="path/to/image4_thumbnail.jpg" /></a>
	<a href="path/to/image5.jpg"><img src="path/to/image5_thumbnail.jpg" /></a>
	<a href="path/to/image6.jpg"><img src="path/to/image6_thumbnail.jpg" /></a>
</div>
```

And call `poptrox()` on it:

```js
var foo = $('#gallery');
foo.poptrox();
```

## Notes

- Poptrox parses *all* anchors inside the element you call it on, even if
they're nested in other stuff. For example, this would totally work:

```html
<div id="gallery">
	<section>
		<h2>Stuff I Like</h2>
		<ul>
			<li><a href="path/to/image1.jpg"><img src="path/to/image1_thumbnail.jpg" /></a></li>
			<li><a href="path/to/image2.jpg"><img src="path/to/image2_thumbnail.jpg" /></a></li>
			<li><a href="path/to/image3.jpg"><img src="path/to/image3_thumbnail.jpg" /></a></li>
		</ul>
	</section>
	<section>
		<h2>Stuff I Don't Like</h2>
		<ul>
			<li><a href="path/to/image1.jpg"><img src="path/to/image1_thumbnail.jpg" /></a></li>
			<li><a href="path/to/image2.jpg"><img src="path/to/image2_thumbnail.jpg" /></a></li>
			<li><a href="path/to/image3.jpg"><img src="path/to/image3_thumbnail.jpg" /></a></li>
		</ul>
	</section>
</div>
```

- Each anchor must link to whatever you want shown in its popup, be it an image
or something else (see below).

- If you want captions on your popups, enable `usePopupCaption` (see below) and assign
a `title` attribute to your `<img>` element, like so:

```html
<a href="path/to/image.jpg"><img src="path/to/image_thumbnail.jpg" title="This right here is a caption." /></a>
```

- You can also use the `caption` option to tell Poptrox where it should look for captions:

```js
caption: null
```

The default behavior, which simply uses the `title` attribute of each `<img>` element.

```js
caption: { selector: "xxxxxx" }
```

Uses the content of the element pointed to by the selector `xxxxxx` (must be inside the anchor).

```js
caption: { selector: "xxxxxx", remove: true }
```

Uses the content of the element pointed to by the selector `xxxxxx` (must be inside the anchor),
then **removes** the element.

```js
caption: function(a) { /* return something */ },
```

(Advanced) Uses a callback function to figure out the caption, where `a` is a jQuery object
pointing to the anchor tag.

## Supported Types

In addition to images, popups can also show other stuff (like YouTube videos).
To do this, point your thumbnail's anchor to the appropriate URL (see below for specifics)
and give it a `data-poptrox` attribute like so:

```html
<a href="http://untitled.tld/path/to/whatever" data-poptrox="type,(width)x(height)"><img src="path/to/thumbnail.jpg" /></a>
```

The `data-poptrox` attribute breaks down like this:

- `type`: The type (eg. `youtube`)
- `(width)x(height)`: An optional width and height for the popup (eg. `800x400`)

### YouTube Videos

- Link format: `http://youtu.be/xxxxxxxxxxx` (found via the "Share" link)
- Type: `youtube`
- Example:

```html
<a href="http://youtu.be/loGm3vT8EAQ" data-poptrox="youtube,800x480"><img src="path/to/thumbnail.jpg" /></a>
```

### Vimeo Videos

- Link format: `http://vimeo.com/xxxxxxxx` (found via the "Share" button under "Embed")
- Type: `vimeo`
- Example:

```html
<a href="http://vimeo.com/22439234" data-poptrox="vimeo,800x480"><img src="path/to/thumbnail.jpg" /></a>
```

### Wistia Videos

- Link format: `http://fast.wistia.net/embed/iframe/fe8t32e27x` (found via "Share" or "Get Link")
- Type: `wistia`
- Example:

```html
<a href="http://fast.wistia.net/embed/iframe/fe8t32e27x" data-poptrox="wistia,800x480"><img src="path/to/thumbnail.jpg" /></a>
```

### Brightcove Videos

- Link format: `http://bcove.me/xxxxxxxx` (found via "Share" or "Get Link")
- Type: `bcove`
- Example:

```html
<a href="http://bcove.me/qly3wjdw" data-poptrox="bcove,636x360"><img src="path/to/thumbnail.jpg" /></a>
```

### Soundcloud Tracks

- Link format: `https://api.soundcloud.com/tracks/xxxxxxxx` (found via the "Share" button 
under "Widget Code" or "WordPress Code")
- Type: `soundcloud`
- Example:

```html
<a href="https://api.soundcloud.com/tracks/93549370" data-poptrox="soundcloud"><img src="path/to/thumbnail.jpg" /></a>
```

### IFRAMEs

- Link format: Anything.
- Type: `iframe`
- Example:

```html
<a href="path/to/whatever.html" data-poptrox="iframe,600x400"><img src="path/to/thumbnail.jpg" /></a>
```

### AJAX Content

- Link format: Anything (as long as it's on the same domain)
- Type: `ajax`
- Example:

```html
<a href="path/to/whatever.html" data-poptrox="ajax,600x400"><img src="path/to/thumbnail.jpg" /></a>
```

### Ignore

This "special" (unspecial?) type just tells Poptrox to treat whatever's in `href` as if it were a normal link.

- Link format: Anything.
- Type: `ignore`
- Example:

```html
<a href="http://n33.co" data-poptrox="ignore"><img src="path/to/thumbnail.jpg" /></a>
```

## Config

`poptrox()` has numerous options one can use or override, if one were so inclined:

```js
foo.poptrox({
	preload:					false,			// If true, preload fullsize images in
												// the background
	baseZIndex:					1000,			// Base Z-Index
	fadeSpeed:					300,			// Global fade speed
	overlayColor:				'#000000',		// Overlay color
	overlayOpacity:				0.6,			// Overlay opacity
	windowMargin:				50,				// Window margin size (in pixels; only comes into
												// play when an image is larger than the viewport)
	windowHeightPad:			0,				// Window height pad
	selector:					'a',			// Anchor tag selector
	caption:					null,			// Caption settings (see docs)
	popupSpeed:					300,			// Popup (resize) speed
	popupWidth:					200,			// Popup width
	popupHeight:				100,			// Popup height
	popupIsFixed:				false,			// If true, popup won't resize to fit images
	useBodyOverflow:			true,			// If true, the BODY tag is set to overflow: hidden
												// when the popup is visible
	usePopupEasyClose:			true,			// If true, popup can be closed by clicking on
												// it anywhere
	usePopupForceClose:			false,			// If true, popup can be closed even while content
												// is loading
	usePopupLoader:				true,			// If true, show the popup loader
	usePopupCloser:				true,			// If true, show the popup closer button/link
	usePopupCaption:			false,			// If true, show the popup image caption
	usePopupNav:				false,			// If true, show (and use) popup navigation
	usePopupDefaultStyling:		true,			// If true, default popup styling will be applied
												// (background color, text color, etc)
	popupBackgroundColor:		'#FFFFFF',		// (Default Style) Popup background color (when 
												// usePopupStyling = true)
	popupTextColor:				'#000000',		// (Default Style) Popup text color (when
												// usePopupStyling = true)
	popupLoaderTextSize:		'2em',			// (Default Style) Popup loader text size
	popupCloserBackgroundColor:	'#000000',		// (Default Style) Popup closer background color
												// (when usePopupStyling = true)
	popupCloserTextColor:		'#FFFFFF',		// (Default Style) Popup closer text color (when
												// usePopupStyling = true)
	popupCloserTextSize:		'20px',			// (Default Style) Popup closer text size
	popupPadding:				10,				// (Default Style) Popup padding (when
												// usePopupStyling = true)
	popupCaptionHeight:			60,				// (Default Style) Popup height of caption area
	popupCaptionTextSize:		null,			// (Default Style) Popup caption text size
	popupBlankCaptionText:		'(untitled)',	// Applied to images that don't have captions
												// (when captions are enabled)
	popupCloserText:			'&#215;',		// Popup closer text
	popupLoaderText:			'&bull;&bull;',	// Popup loader text
	popupClass:					'poptrox-popup',// Popup class
	popupSelector:				null,			// (Advanced) Popup selector (use this if you 
												// want to replace the built-in popup)
	popupLoaderSelector:		'.loader',		// (Advanced) Popup Loader selector
	popupCloserSelector:		'.closer',		// (Advanced) Popup Closer selector
	popupCaptionSelector:		'.caption',		// (Advanced) Popup Caption selector
	popupNavPreviousSelector:	'.nav-previous',// (Advanced) Popup Nav Previous selector
	popupNavNextSelector:		'.nav-next',	// (Advanced) Popup Nav Next selector
	onPopupClose:				null,			// Called when popup closes
	onPopupOpen:				null			// Called when popup opens
});
```

## License

jquery.poptrox.js is released under the MIT license.

Copyright © n33

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
