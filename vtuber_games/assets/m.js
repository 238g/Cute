var __g=genGamesInfo().GamesInfo;//GamesInfo2.js
var __m={};
var __t={};
function openMenu(id,num){
  var m=__m[num],tl=__t[num];
  m.hide();
  tl.each(function(i,c){
    var e=$(c);
    e.hasClass(id)?e.addClass('w3-dark-grey'):e.removeClass('w3-dark-grey');
  });
  $('#'+id).show();
}
$(function(){
  var e,v,l,k,l2,k2;
  //////////////
  e='';
  l=[{l:'#conclusion',v:'結論'},{l:'#story',v:'語り'},{l:'#tech',v:'技術の話'},{l:'#game',v:'ゲーム'}];
  for(k in l){
    v=l[k];
    e+='<div class="w3-col s3"><a href="'+v.l+'" class="w3-button w3-block w3-black">'+v.v+'</a></div>';
  }
  $('.top_contents').html(e);
  //////////////
  l={
    1:[{i:'WhatAction',v:'何をしたの？'},{i:'Why',v:'なぜ50個も？'},{i:'SecCreation',v:'二次創作'},{i:'Next',v:'今後は？'}],
    2:[{i:'WhatTech',v:'なにで開発？'},{i:'WhatServer',v:'サーバーは？'},{i:'MakeGame',v:'ゲーム作りたい'}],
  };
  for(k in l){
    l2=l[k];
    e='';
    for(k2 in l2){
      v=l2[k2];
      e+=genTabLink(k2,v,k);
    }
    $('.menu_btns_'+k).html(e);
    __m[k]=$('.menu_page_'+k+' .menu');
    __t[k]=$('.menu_page_'+k+' .tablink');
  }
  function genTabLink(k,v,n){return '<a href="javascript:void(0)" onclick="openMenu(\''+v.i+'\','+n+');"><div class="'+v.i+' w3-col s6 tablink'+(k==0?' w3-dark-grey':'')+'">'+v.v+'</div></a>';}
  //////////////
  var keys=Object.keys(__g);

  $('.rnd_img').each(function(i,c){
    var e=$(c);
    var info=__g[keys[keys.length*Math.random()<<0]];
    e.html('<a href="'+info.url+'" target="_blank"><img src="'+(info.tc||__g[1050].tc)+'" class="w3-image" style="width:100%"><span class="w3-tag">'+(info.tc?info.title:__g[1050].title)+'</span></a>');
  });
});
