function pageInit(){
	var node = document.createElement('div');                 // Create a <div> node

	node.setAttribute('id', 'footer');
	node.style.cssText = 'position: fixed; bottom: 0px; color: rgb(0, 0, 0); height: 100px; z-index: 1000;width: 50%;margin: 0 auto; ';
	document.getElementsByTagName('body')[0].appendChild(node);

	var nodePad = document.createElement('div');                 // Create a <div> node     
	 
	nodePad.setAttribute('id', 'footerpad');
	nodePad.style.cssText = 'color: #000;opacity: 0.7;height: 100px;z-index: 1000';
	document.getElementsByTagName('body')[0].appendChild(nodePad);	
	
	var divCSS = 'background:#d3d3d3;color: #000;opacity: 0.7;height: 100px;z-index: 1000';
	document.body.innerHTML += '<div id='footer' style='' + divCSS + ''>Something in footer</div>';
	document.addEventListener('DOMContentLoaded', function (event) {
    var element = document.getElementById('container');
    var height = element.offsetHeight;
    if (height < screen.height) {
        document.getElementById('footer').classList.add('stikybottom');
    }
	}, false);
	
	//getShipmentListScriptView();

}