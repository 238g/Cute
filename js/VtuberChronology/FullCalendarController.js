$(document).ready(function() {
	//////////////////////////////////////// fullCalendar
	$('#calendar').fullCalendar({
		header:{
			left:'prev next today',
			center:'title',
			right:'listMonth,listWeek,listDay,listYear,month',
		},
		views:{//FIXED
			listMonth:{buttonText:'月別/Month'},
			listWeek:{buttonText:'週別/Week'},
			listDay:{buttonText:'日別/Day'},
			listYear:{buttonText:'年別/Yeah'},
		},
		locale:'ja',
		editable:!1,
		defaultView:__defaultView,
		listDayFormat:'YYYY-MM-D',
		listDayAltFormat:'YYYY-MM-D',
		events:function(start,end,timezone,callback){
			$.ajax({
				type:'GET',
				url:__getEventsUrl,
				dataType:'text',
				cache:!1,
				success:function(csv){
					var events=formatCsv2(csv);
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
					(ev.descImg&&'<img src="'+ev.descImg+'" /><br>')+
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
		eventRender:function(ev,elem){
			var el=elem[0];
			var ttl=$(el).find('.fc-list-item-title');
			ttl.css('font-weight','bold');
			ev.subTitle&&ttl.append('<p>'+ev.subTitle+'</p>');
			// ev.desc&&ttl.append('<p>'+ev.desc+'</p>');
			ev.descImg&&$(el).find('.fc-list-item-marker').html('<img src="'+ev.descImg+'" width=60 height=60 />');
		},
		loading:function(bool){
			// TODO loading animation
			// $('#loading').toggle(bool);
			// console.log(bool);
		},
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

function formatCsv2(csv){
	var res=[];
	var rows=csv.slice(0,-1).split('\n');
	var header=rows[0].split(',');
	for (var rowNum in rows) {
		if(rowNum==0)continue;
		var row=rows[rowNum].split(',');
		var tmp={};
		for(var columnNum in row){
			if(columnNum==3&&row[3]){
				var darr=row[3].split('-');
				var dt=new Date(darr[0],Number(darr[1])-1,darr[2]);
				dt.setDate(dt.getDate()+1);
				row[3]=Ymd(dt);
			}
			tmp[header[columnNum]]=row[columnNum];
		}
		res.push(tmp);
	}
	return res;
}

function Ymd(dt){
	var dt=dt||new Date();
	var Y = dt.getFullYear();
	var m = ('0'+(dt.getMonth()+1)).slice(-2);
	var d = ('0'+(dt.getDate())).slice(-2);
	return Y+'-'+m+'-'+d;
}
