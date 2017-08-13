/** BaseComponent
 *
 *	function BaseComponent 
 *	@constructor
 *	@suppress {checkTypes} 
 */
function BaseComponent() { 	
	this.attribute = { 
		id:CanvasUI.UUID(), 
		type:'BaseComponent', 
		x:0, y:0, // int, axis position
		width:0, height:0, // int, dimensions
		angle:0, // int, angle of rotation in degrees
		opacity:100, // int, sprite opacity 0-100
		layer:0, // maximum of 5 layers rendering is lowest layer is first
		zIndex:0, // priority within the same layer
		state:0 // state, -1:destroy, 0:neutral, 1:active 
	}

	this.trait = {fade:false, moveto:false, animation:false}; // 

	this.instancevar = {};
};

BaseComponent.prototype.init = function( canvasui ){  };

BaseComponent.prototype.update = function( canvasui ){ };

BaseComponent.prototype.set = function( attribute ) {
	for (var name in attribute) { 
		this.attribute[name] = attribute[name]; 		
	}	
}

BaseComponent.prototype.getSelf = function() {
	return new BaseComponent();
}

BaseComponent.prototype.copy = function() {
	var base = this.getSelf();
	base.context = this.context;
	return base;
}

BaseComponent.prototype.destroy = function() {
	this.attribute.state = -1;
}	

BaseComponent.prototype.onCreate = function() {}

BaseComponent.prototype.onDestroy = function() {}

