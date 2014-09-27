// overlap
// onStartAniIn
// onEndAniIn
// onStartAniOut
// onEndAniOut

function ViewManager( settings ) {

	if( !( this instanceof ViewManager ) ) 
		return new ViewManager( settings );

	var s = this.s = settings || {};

	s.overlap = s.overlap === undefined ? true : s.overlap;

	this.cContent = null;
	this.nContent = null;
};

ViewManager.prototype = {

	get overlap() {

		return this.s.overlap;
	},

	set overlap( value ) {

		this.s.overlap = value;
	},

	show: function( content, onComplete ) {

		if( content != this.nContent &&
			content != this.cContent ) {

			if( this.nContent ) {

				this.nContent.destroy();
			}

			this.nContent = content;

			if( content.init )
				content.init( this.swap.bind( this, onComplete ) ); 
			else
				this.swap( onComplete );
		}
	},

	clear: function( onComplete ) {

		if( this.nContent )
			this.nContent.destroy();

		if( this.cContent ) {

			this.cContent.aniOut( function( oldContent ) {

				if( oldContent.destroy )
					oldContent.destroy();

				if( onComplete )
					onComplete( oldContent );
			}.bind( this, this.cContent ));
		}
	},

	swap: function( onComplete ) {

		var s = this.s,
			oldContent = this.cContent,
			newContent = this.nContent,
			onNewIn = function() {

				if( s.onEndAniIn )
					s.onEndAniIn( newContent, oldContent );

				if( onComplete )
					onComplete( newContent, oldContent );
			},
			onOldOut;

		// call a callback that we're starting to animatein content
		if( s.onStartAniIn ) 
			s.onStartAniIn( newContent, this.cContent );

		// check if there's content on screen already
		if( this.cContent ) {

			// setup the old out function
			onOldOut = function() {

				if( s.onEndAniOut )
					s.onEndAniOut( newContent, oldContent );

				if( oldContent.destroy )
					oldContent.destroy();

				if( !s.overlap )
					newContent.aniIn( onNewIn );
			};

			// call a callback that we're starting to animateout content
			if( s.onStartAniOut )
				s.onStartAniOut( newContent, oldContent );

			oldContent.aniOut( onOldOut );

			if( s.overlap )
				newContent.aniIn( onNewIn );
		} else {

			// just bring new content
			newContent.aniIn( onNewIn );
		}

		this.cContent = newContent;
		this.nContent = null;
	}
};

module.exports = ViewManager;