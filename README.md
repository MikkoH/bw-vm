bw-vm
=====

This is a view manager for bigwheel (it brings in out content)


### Example
```javascript
var viewmanager = require( 'bw-vm' )();

var section = require( './yourSection' ); // your section might have init, aniIn, aniOut, destroy, resize
var someDataYouMightWantToPass = {

	imgUrl: './someImage.jpg'	
};

var ifYouWantToKnowWhenTheSectionIsIn = function() {};

viewmanager.show( section, someDataYouMightWantToPass, ifYouWantToKnowWhenTheSectionIsIn );
```
