$(document).ready(function() {
	//////////////////////////////////////// fullCalendar
	$('#calendar').fullCalendar({
		header:{
			left:'prev next',
			////// left:'prev next today',
			center:'title',
			right:'listMonth,listWeek,listDay,listYear,month',
		},
		views:{//FIXED
			listMonth:{buttonText:'月別/Month'},
			listWeek:{buttonText:'週別/Week'},
			listDay:{buttonText:'日別/Day'},
			listYear:{buttonText:'全て/ALL'},
		},
		locale:'ja',
		editable:!1,
		defaultView:'listYear',
		listDayFormat:'MM-D',
		////// listDayFormat:'YYYY-MM-D',
		listDayAltFormat:'MM-D',
		////// listDayAltFormat:'YYYY-MM-D',
		titleFormat:'MM-D',
		now:Ymd(2018),
		events:function(start,end,timezone,callback){
			////// TODO======================================// start=moment();// end=moment().add(1, 'years');// console.log(start.year(),end.year());
			$.ajax({
				type:'GET',
				url:'datas/VtuberBirthday/Events.csv',
				dataType:'text',
				cache:!1,
				success:function(csv){
					var events=formatCsv(csv);
					if(events==!1)callback([{title:'通信エラー',start:Ymd()}]);
					callback(events);
				},
				error:function(a,b,c){alart(a+b+c);return callback([{title:'通信エラー',start:Ymd()}]);},
			});
		},
		eventClick:function(ev/*,jsEv,view*/){
			var dialog=$('#dialog-modal');
			dialog.dialog({
				minHeight:window.innerHeight*.6,
				minWidth:window.innerWidth*.5,
				modal:!0,
				show:500,
				title:ev.title,
			});
			dialog.html(
				'<p>'+
					(ev.title?'<p><b>'+ev.title+'</b></p>':'')+
					(ev.descImg?'<img src="'+ev.descImg+'" /><br>':ev.img?'<img src="'+ev.img+'" /><br>':'')+
					'<br>'+
					(ev.subTitle?'<p>'+ev.subTitle+'</p>':'')+
					(ev.desc?'<p>'+ev.desc+'</p>':'')+
					'<p><b>'+
						(ev.yt?'<a href="'+ev.yt+'" target="_blank"> YouTube </a>':'')+
						(ev.twitter?'<a href="https://twitter.com/'+ev.twitter+'" target="_blank"> Twitter </a>':'')+
					'</b></p>'+
				'</p>'
			);
		},
		noEventsMessage:'NONE',
		allDayText:'',
		theme:!0,
		themeSystem:'jquery-ui',
		loading:function(bool){
			////// TODO loading animation // $('#loading').toggle(bool); // console.log(bool);
		},
		viewRender:function(view,element){
			////// TODO======================================// view.intervalStart=moment();// console.log(view.intervalStart.year()); // 2018// element[0].innerHTML=''; // render NONE! SameThis=> element[0].innerText=3333;
			var m=view.start.month();
			var w=view.start.week();
			var d=view.start.date();
			switch(view.type){
				case 'listYear':hideAll();break;
				case 'listWeek':11==m&&1==w&&31==d?hidePrev():11==m&&1==w&&30==d?hideNext():showAll();break;
				case 'listDay':m==0&&d==1?hidePrev():m==11&&d==31?hideNext():showAll();break;
				case 'listMonth':m==0?hidePrev():m==11?hideNext():showAll();break;
				case 'month':m==11?hidePrev():m==10?hideNext():showAll();break;
			}
		},
		eventRender:function(ev,elem){
			var el=elem[0];
			var ttl=$(el).find('.fc-list-item-title');
			ttl.css('font-weight','bold');
			ev.subTitle&&ttl.append('<p>'+ev.subTitle+'</p>');
			// ev.desc&&ttl.append('<p>'+ev.desc+'</p>');
			ev.img&&$(el).find('.fc-list-item-marker').html('<img src="'+ev.img+'" />');
		},
		//loading->events->viewRender->loading->events(callback)->eventRender
	});
	//////////////////////////////////////// fullCalendar

	//////////////////////////////////////// Change Language
	$.each($.fullCalendar.locales,function(localeCode){
		$('#locale-selector').append(
			$('<option/>')
				.attr('value',localeCode)
				.prop('selected',localeCode=='ja')
				.text(localeCode)
		);
	});
	$('#locale-selector').on('change',function(){
		this.value&&$('#calendar').fullCalendar('option','locale',this.value);
	});
	//////////////////////////////////////// Change Language
});

function hidePrev(){
	disabledPrevBtn(!0);
	disabledNextBtn(!1);
}

function hideNext(){
	disabledPrevBtn(!1);
	disabledNextBtn(!0);
}

function showAll(){
	disabledPrevBtn(!1);
	disabledNextBtn(!1);
}

function hideAll(){
	disabledPrevBtn(!0);
	disabledNextBtn(!0);
}

function disabledPrevBtn(tf){
	tf==!0?$('.fc-prev-button').addClass('ui-state-disabled'):$('.fc-prev-button').removeClass('ui-state-disabled');
	$('.fc-prev-button').prop('disabled',tf);
}
function disabledNextBtn(tf){
	tf==!0?$('.fc-next-button').addClass('ui-state-disabled'):$('.fc-next-button').removeClass('ui-state-disabled');
	$('.fc-next-button').prop('disabled',tf);
}

function formatCsv(csv){
	var res=[];
	var rows=csv.slice(0,-1).split('\n');
	var header=rows[0].split(',');
	for (var rowNum in rows) {
		if(rowNum==0)continue;
		var row=rows[rowNum].split(',');
		var tmp={};
		for(var columnNum in row)tmp[header[columnNum]]=row[columnNum];
		res.push(tmp);
	}
	return res;
}

function Ymd(Y,m,d){
	return (Y||new Date().getFullYear())+'-'+(m||('0'+(new Date().getMonth()+1)).slice(-2))+'-'+(d||('0'+(new Date().getDate())).slice(-2));
}
