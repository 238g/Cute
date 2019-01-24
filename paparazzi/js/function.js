var inputEnabled=!0;
var sizeTextElem=$('.size_text');
var resizeDragElem=$('.resize-drag');
var sound = new Howl({
	src: ['assets/camera-shutter2.mp3', 'assets/camera-shutter2.wav'],
	autoplay: false,
	loop: false,
	volume: .5,
});

// http://interactjs.io/
interact('.resize-drag')
	.draggable({
		onmove: window.dragMoveListener,
		restrict: {
			restriction: 'parent',
			elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
		},
	})
	.resizable({
		// resize from all edges and corners
		edges: { left: true, right: true, bottom: true, top: true },

		// keep the edges inside the parent
		restrictEdges: {
			outer: 'parent',
			endOnly: true,
		},

		// minimum size
		restrictSize: {
			min: { width: 100, height: 50 },
		},

		inertia: true,
	})
	.on('resizemove', function (event) {
		if(inputEnabled){
			var target = event.target,
					x = (parseFloat(target.getAttribute('data-x')) || 0),
					y = (parseFloat(target.getAttribute('data-y')) || 0);

			// update the element's style
			target.style.width	= event.rect.width + 'px';
			target.style.height = event.rect.height + 'px';

			// translate when resizing from top or left edges
			x += event.deltaRect.left;
			y += event.deltaRect.top;

			target.style.webkitTransform = target.style.transform =
					'translate(' + x + 'px,' + y + 'px)';

			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);

			// update text
			sizeTextElem.text(Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height));
		}
	});

$('.fixed_resize_btn').click(function(){
	if(inputEnabled){
		inputEnabled=!1;
		$(this).text('サイズ固定中');
	}else{
		inputEnabled=!0;
		$(this).text('サイズ固定');
	}
	$(this).toggleClass('active');
});

$('.shutter_click_btn').click(function(){
	var count=$(this).data('count');
	flash(count);
});

function flash(count){
	sound.play();
	resizeDragElem.animate({
		backgroundColor:'#ffffff',
	},rnd(30,120),null,function(){
		resizeDragElem.animate({
			backgroundColor:'#00ff00',
		},rnd(30,120),null,function(){
			count--;
			count>0&&flash(count);
		});
	});
}

function rnd(min,max){
	return Math.floor(Math.random()*max)+min;
}

var isHide=!1;
$('.hide_btn').click(function(){
	$('.may_hide').toggle();
	if(isHide){
		$(this).text('隠す');
		isHide=!1;
	}else{
		$(this).text('表示する');
		isHide=!0;
	}
	$('.operator').toggleClass('active');
});

var slider = document.getElementById("sliderRange");
var output = document.getElementById("volume");
output.innerHTML = slider.value;
slider.oninput = function() {
	var volume = this.value;
	output.innerHTML = ("00" + volume).slice(-3);
	sound.volume(volume*.01);
}