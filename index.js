function ViewManager( settings ) {

	if( !( this instanceof ViewManager ) ) 
		return new ViewManager( settings );

	var s = this.s = settings || {};

	s.overlap = s.overlap === undefined ? true : s.overlap;
	s.width = s.width || 980;
	s.height = s.height || 570;

	this.cContent = null;
	this.nContent = null;
}

ViewManager.prototype = {

	get overlap() {

		return this.s.overlap;
	},

	set overlap( value ) {

		this.s.overlap = value;
	},

	show: function( content, data, onComplete ) {

		// check if data was passed in
		if( onComplete === undefined &&
			typeof data == 'function' ) {

			onComplete = data;
			data = null;
		}

		this.data = data;

		if( content != this.nContent && content != this.cContent ) {

			if( this.nContent && this.nContent.destroy )
				this.nContent.destroy(this.data, function() { });

			this.nContent = content;

			if( content.init ) {

				content.init( this.data, this.swap.bind( this, this.nContent, onComplete ) ); 
			} else {

				this.swap( this.nContent, onComplete );
			}
		}
	},

	clear: function( onComplete ) {

		if( this.nContent && this.nContent.destroy )
			this.nContent.destroy( this.data, function() { } );

		if( this.cContent ) {

			var onOldOut = function( oldContent ) {

				if( oldContent.destroy )
					oldContent.destroy( this.data , function() { } );

				if( onComplete )
					onComplete( oldContent );
			}.bind( this, this.cContent );

			// now take out countent
			if( this.cContent.animateOut )
				this.cContent.animateOut( this.data , onOldOut );
			else
				onOldOut();
		}
	},

	resize: function( width, height ) {

		var s = this.s;

		s.width = width;
		s.height = height;

		if( this.cContent && this.cContent.resize )
			this.cContent.resize( width, height );
	},

	swap: function( newContent, onComplete ) {

		if( newContent == this.nContent ) {

			var s = this.s,
				oldContent = this.cContent,
				onNewIn = function() {

					if( s.onEndAniIn )
						s.onEndAniIn( newContent, oldContent );

					if( onComplete )
						onComplete( newContent, oldContent );
				},
				onOldOut;

			// resize the newContent if it has a resize method
			if( newContent.resize )
				newContent.resize( s.width, s.height );

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
						oldContent.destroy( this.data, function() { } );

					if( !s.overlap ) {

						if( newContent.animateIn )
							newContent.animateIn( this.data, onNewIn );
						else
							onNewIn();
					}
				}.bind(this);

				// call a callback that we're starting to animateout content
				if( s.onStartAniOut )
					s.onStartAniOut( newContent, oldContent );

				if( oldContent.animateOut )
					oldContent.animateOut( this.data, onOldOut );
				else
					onOldOut();

				if( s.overlap ) {

					if( newContent.animateIn )
						newContent.animateIn( this.data, onNewIn );
					else
						onNewIn();
				}
			} else {

				// just bring new content
				if( newContent.animateIn )
					newContent.animateIn( this.data, onNewIn );
				else
					onNewIn();
			}

			this.cContent = newContent;
			this.nContent = null;
		}
	}
};

module.exports = ViewManager;