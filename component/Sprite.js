/** Sprite
 *  
 *  function Sprite
 *	@constructor
 *	@extends {BaseComponent} 
 *	@param {Object} attribute  
 *	@see {@link CanvasUI}
 */
function Sprite( attribute ) {

	CanvasUI.extend(this, new BaseComponent());		
	
	this.attribute.type = 'Sprite'; 		
	this.attribute.bgc = false; // mixed|string, background image color 
	this.attribute.image = { src:'', instance:{ src:'', onload:function(){} } }; // object, image instance	
	this.attribute.origin = {x:0,y:0}; // object, offset value from origin		
	this.attribute.sheet = {nh:1,nw:1,px:0,py:0}; // when the image is a spritesheet define the count per width and height, position in the sheet
	this.attribute.container = []; // mixed boolean|array object, text character image array		

	CanvasUI.extend(this.attribute, attribute);

}

/**	Check if the object is an instance of Sprite
 *
 *	static function isInstance
 *	@param {Object} obj
 */
Sprite.isInstance = function( obj ) {
	return obj instanceof Sprite;
}

/**	Initialized sprite call
 *
 *	function init
 */
Sprite.prototype.init = function( canvasui ) {		
	
	this.attribute.image.instance = new Image();
	this.attribute.image.instance.src = this.attribute.image.src;		
	this.attribute.image.instance.onload = this.onReady;

	this.onCreate();
}


/**	Update the sprite in the canvas
 *
 *	function update
 *	@param {Object} canvasui
 */
Sprite.prototype.update = function( canvasui ) { 
	if( this.attribute.pr ) { return; }
	
	this.attribute.pr = true;

	this.attribute.scale = canvasui.scale;

	this.cache();
	
	this.context['imageSmoothingEnabled'] = false; 
	this.context['webkitImageSmoothingEnabled'] = false;
	this.context['mozImageSmoothingEnabled'] = false;

	if( this.attribute.bgc ) {
		this.context.fillStyle = this.attribute.bgc;
		this.context.fillRect(this.attribute.x+canvasui.viewport.left, this.attribute.y+ canvasui.viewport.top, this.attribute.width*this.attribute.scale, this.attribute.height*this.attribute.scale);	
	}

	for(var i=0;i<this.attribute.container.length;i++){ 			

		this.context.save();	
		
		this.context.translate( (this.attribute.x + this.attribute.container[i].xl + canvasui.viewport.left ), (this.attribute.y +  canvasui.viewport.top ) );
		
		this.context.rotate( this.attribute.angle * Math.PI/180 );

		this.context.globalAlpha = this.attribute.opacity/100;	

		this.context.drawImage( this.attribute.image.instance, 
			this.attribute.container[i].xp, 
			this.attribute.container[i].yp,
			this.attribute.character.width, 
			this.attribute.character.height, 
			this.attribute.origin.x, this.attribute.origin.y,
			this.attribute.width * this.attribute.scale, 
			this.attribute.height * this.attribute.scale 
		);	
		
		this.context.restore();

	}

	this.attribute.pr = false;		
}


/**	Clone the current Sprite instance
 *
 *	function copy
 *	@return {Sprite} cloned instance
 */
Sprite.prototype.copy = function() {
	var sprite = new Sprite( this.attribute );

	// issue a new UUID on the cloned sprite
	sprite.attribute.id = CanvasUI.UUID();	

	// copy the animation sprite 
	sprite.animation = this.animation;

	// copy all the defined traits on this Sprite
	if( this.trait && Object.keys(this.trait).length>0 ) {
		for (var name in this.trait) { 		
			if( this.trait[ name ] ){	
				sprite.trait[ name ] = this.trait[ name ].copy();			
			}
		} 
	}

	return sprite;
}


/**	Define the cached images in the container
 *
 *	function cache
 */
Sprite.prototype.cache = function() {
	if( this.attribute.container.length == 0 ) { 
		this.attribute.container = [];
		if( this.attribute.image ) {
			if( this.attribute.image.width == undefined || this.attribute.image.height == undefined ) {
				this.attribute.image.width = this.attribute.image.instance.width;
				this.attribute.image.height = this.attribute.image.instance.height;
			}

			this.attribute.container.push({
				xp:this.attribute.sheet.px*(this.attribute.image.width/this.attribute.sheet.nw), 
				yp:this.attribute.sheet.py*(this.attribute.image.height/this.attribute.sheet.nh), 			
				xl:0
			});			

			this.attribute.character = {
				width:this.attribute.image.width/this.attribute.sheet.nw,
				height:this.attribute.image.height/this.attribute.sheet.nh 
			};	
		}		
	}
}


/** Sprite callbacks
 */
Sprite.prototype.onCreate = function() {}

Sprite.prototype.onDestroy = function() {}
