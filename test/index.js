var vm = require( '../' );

var DURATION_INI = 30,
	DURATION_ANI = 1000;

var Content = {

	init: function( data, onComplete ) {

		if( onComplete == undefined )
			onComplete = data;

		console.log( ( Date.now() - this.startTime ), 'init', this.name );
		console.log( 'init data', data );

		setTimeout( onComplete, DURATION_INI );		
	},

	resize: function( w, h ) {

		console.log( ( Date.now() - this.startTime ), 'resize', this.name, w, h );
	},

	aniIn: function( onComplete ) {

		console.log( ( Date.now() - this.startTime ), 'aniIn', this.name );

		setTimeout( onComplete, DURATION_ANI );
	},

	aniOut: function( onComplete ) {

		console.log( ( Date.now() - this.startTime ), 'aniOut', this.name );

		setTimeout( onComplete, DURATION_ANI );
	},

	destroy: function() {

		console.log( ( Date.now() - this.startTime ), 'destroyed', this.name );
	}
};

doNormal();

function doNormal( onComplete ) {

	var v = vm(),
		c1 = Object.create( Content ),
		c2 = Object.create( Content );

	c1.name = 'c1';
	c2.name = 'c2';
	c1.startTime = c2.startTime = Date.now();

	console.log( '---NORMAL---' );
	v.show( c1, function() {

		v.show( c2, function() {

			console.log( '--------------\n' );
			doWithoutOverlap();
		});
	});
}

function doWithoutOverlap() {

	var v = vm( {
			overlap: false
		}),
		c1 = Object.create( Content ),
		c2 = Object.create( Content );

	c1.name = 'c1';
	c2.name = 'c2';
	c1.startTime = c2.startTime = Date.now();

	console.log( '---NO OVERLAP---' );
	v.show( c1, 'something', function() {

		v.show( c2, 'something else', function() {

			console.log( '------------\n' );
		});
	});
}