/** Define global variables
	1. raf = Animation frame function. Request Animation Frame.
	2. cgv = Canvasui global variables. 
	  2.1 preview - preview flag to display Canvas.log , set the value to false to prevent console logging
	  2.2 uid - auto-increment general purpose unique id
 */
var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f){return setTimeout(f, 1000/60)}; 
var cgv = { preview:true, uid:0 };


/** CanvasUI, main controller for the project canvas
 *
 *	function CanvasUI 
 *	@constructor
 */
function CanvasUI() {

	this.fps = 60;
	this.scale = 1;	// canvas scale
	this.state = 0; // 0: preparing layout, 1: start layout, 2: pause layout, 3: processing layout, 4: standby layout, 5: end of layout	
	this.services = new Object(); // service object container
	this.components = new Object(); // component object container
	this.viewport = {left:0, top:0};
	this.layout = { height:window.innerHeight, opacity:100, width:window.innerWidth };

	var canvas = document.createElement('canvas');
	canvas.id = 'canvas-'+CanvasUI.UUID();
	canvas.width = this.layout.width;
	canvas.height = this.layout.height;	
	document.body.appendChild(canvas); 
	
	this.context = canvas.getContext("glCanvas") ? canvas.getContext("glCanvas") : canvas.getContext("2d"); // context, canvas webgl or 2d 

	this.context.scale(this.scale, this.scale);

	CanvasUI.log('Canvas Created.', this.context );
};


/** Generate unique id
 *	
 *	function static UUID
 *	@return string, unique id
 */ 
CanvasUI.UUID = function(){	
	return cgv.uid++;
};

CanvasUI.extend = function(self, base) {
	for(var name in base){ 
		if( self[name] === undefined || (typeof base[name]!=='function') ) { self[name] = base[name];  }		
	}
	return self;
}

CanvasUI.log = function( log, obj ) {
	if( cgv.preview && console && console.debug ){ 
		console.debug( log, obj ); 			
	}
}

/** Update, Replace canvasui property
 *   
 *	function set
 *	@param {Object} property for canvas ui
 */	
CanvasUI.prototype.set = function( property ) {
	for (var name in this) { this[name] = property[name]; }
};

/** Add a component that will be drawn or used in the canvas, layout
 *   
 *	function addComponent
 *	@see Sprite, SpriteFont, Mouse
 *	@param {Object} service object, 
 */	
CanvasUI.prototype.addService = function( service ){	
	service.context = this.context;	// assign the canvas context
	service.init( this ); // initialize the service
	this.services[ service.attribute.id ] = service; // add into the service dictionary
};	

/** Add a component that will be drawn or used in the canvas, layout
 *   
 *	function addComponent
 *	@param {Object} component object, @see Sprite, SpriteFont, Mouse
 */	
CanvasUI.prototype.addComponent = function( component ){	
	component.context = this.context;	// assign the canvas context
	component.init( this ); // initialize the component

	if( component.trait &&  Object.keys(component.trait).length>0 ) {
		for (var name in component.trait) { 		
			if( component.trait[ name ] ){		
				component.trait[ name ].component = component;
				component.trait[ name ].init(); 
			}
		} 
	}

	this.components[ component.attribute.id ] = component; // add into the component dictionary
};


/**	Retrieved components based on their id
 *   
 *	function removeComponentById
 *	@param {string} id
 */	
CanvasUI.prototype.getComponentById = function( id ) {
	if( this.components[ id ] ) {
		return this.components[ id ];
	}	
	return false;
};


/**	Remove components based on their id
 *   
 *	function removeComponentById
 *	@param {string} id
 */	
CanvasUI.prototype.removeComponentById = function( id ) {
	if( this.components[ id ] ) {
		this.components[ id ].onDestroy();
		delete this.components[ id ];
	}	
};


/** Perform rendering based on thier y-position, presents isometric drawing
 *   
 * 	function updateRenderIsometric
 */
CanvasUI.prototype.updateRenderIsometric = function() {
	var s = this;
	var sprites = [];
	var sprites_destroy = [];
	for(var r in s.components) {
		
		this.updateTrait( s.components[r] );

		if( s.components[r].attribute.type == 'Sprite' || s.components[r].attribute.type == 'SpriteFont'){ 
			if( s.components[r].attribute.state == -1 ) {
				sprites_destroy.push( s.components[r]  );
			}
			else {
				sprites.push( s.components[r] );
			}			
		}
		else {
			s.components[r].update( this );
		}
	}	

	sprites.sort(function(a, b) {
		if (a.attribute.y+a.attribute.origin.y < b.attribute.y+b.attribute.origin.y) return -1;
		if (a.attribute.y+a.attribute.origin.y > b.attribute.y+b.attribute.origin.y) return 1;
		if (a.attribute.zIndex < b.attribute.zIndex) return -1;
		if (a.attribute.zIndex > b.attribute.zIndex) return 1;
		return 0;
	});

	for(var ly=0;ly<5;ly++){
		for(var i=0;i<sprites.length;i++){ if(sprites[i].attribute.layer==ly) { sprites[i].update( this  ); } }	
	}

	for(var i=0;i<sprites_destroy.length;i++){
		this.removeComponentById( sprites_destroy[i].attribute.id );
	}
};


/** Run the update on all components 
 *   
 * 	function updateRenderNormal
 */
CanvasUI.prototype.updateRenderNormal = function() {
	for(var r in this.components) {
		this.updateTrait( this.components[r] );
		this.components[r].update( this );	
	}	
};


/** Run the update on all traits of the component
 *   
 * 	function updateTrait
 */
CanvasUI.prototype.updateTrait = function( component ) {	
	for (var name in component.trait) { 
		if( component.trait[ name ] ){
			component.trait[ name ].component = component;
			component.trait[ name ].update(); 
		}	
	}
	
}


/** Perform canvas update
 *   
 * 	function update
 */ 		 
CanvasUI.prototype.update = function() {
	var s = this;
	this.context.clearRect(0, 0, s.layout.width, s.layout.height);	
	this.context.canvas.style.opacity = s.layout.opacity/100;
	this.updateRenderIsometric();	

	setTimeout(function(){ 
		raf(function(){  
			if( s.state==1 || s.state==4 ){ 
				s.state = 3;
				s.update();
				s.state = 4; 
			}  
			else if( s.state==3 ){
				setTimeout( function(){ s.update(); }, 1000/s.fps);
			}
		});  
	},1000/s.fps);					
	this.onUpdate();
};


/** Start the canvasui process
 *   
 * 	function start
 */
CanvasUI.prototype.start = function() {
	this.state = 1;
	this.onStart();
	this.update();
};


/** Pause the canvasui process
 *   
 * 	function pause
 */
CanvasUI.prototype.pause = function() {
	this.state = 2;
};


/** Resume the canvasui process
 *   
 * 	function resume
 */
CanvasUI.prototype.resume = function() {
	this.state = 4;
	this.update();
};

/** CanvasUI callbacks
 */
CanvasUI.prototype.onStart = function(){ };	

CanvasUI.prototype.onUpdate = function(){ };
