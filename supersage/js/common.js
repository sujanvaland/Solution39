window.addEventListener('DOMContentLoaded',function(){$('.alert-socket__btn').click(function(){$('.alert-socket__content').toggle(500,function(){let id=$(this).find('li:first-child').data('alert_item');if(id){cookie('messageIteration',id,{expires:2592e6});}});});eventsWebSocket();});function eventsWebSocket(){if(typeof io==='undefined'){return false;}
var params={delay:7,cookie:{expires:2592e3,},message:{'regLevelEvent':[l('ws-regLevel_0'),l('ws-regLevel_1'),l('ws-regLevel_2'),l('ws-regLevel_3'),],'newUserPlaceEvent':l('ws-newUserPlace'),'upgrageEvent':l('ws-upgrade'),'reinvestEvent':l('ws-reinvest'),'missedEthReceive':l('ws-missedEthReceive'),'sentExtraEthDividends':l('ws-sentExtraEthDividends'),'cannotSendMoneyEvent':l('ws-cannotSendMoneyEvent'),'leadingPartner':l('ws-leadingPartner'),'leadingPlacePurchase':l('ws-leadingPlacePurchase'),},rates:null,levels:null,events:null,messageIteration:0,storage:{},container:{el:$('.alert-socket__items'),cell:$('.alert-socket__cell'),btn:$('.alert-socket__btn'),wrapper:$('.alert-socket__content'),countItems:20,},eventsTypeIcon:{'regLevelEvent':'useradd.svg','newUserPlaceEvent':'newuserplace.svg','upgrageEvent':'upgrade.svg','reinvestEvent':'reinvest.svg','missedEthReceive':'missed.svg','sentExtraEthDividends':'dividends.svg','cannotSendMoneyEvent':'','leadingPartner':'leading.svg','leadingPlacePurchase':'dividends.svg',}};params.delay*=1000;var socket=io.connect('wss://forsage.io:2087',{rejectUnauthorized:false,rememberTransport:false,secure:true,});socket.on('addEvents',function(data){data=JSON.parse(data);if(!data.events){notify('empty variable "data.events"');return;}
if(!data.params){notify('empty variable "data.params"');return;}
if(!data.params.levels){notify('empty variable "data.params.levels"');return;}
if(!data.params.storage){notify('empty variable "data.params.storage"');return;}
params.events=data.events.reverse();params.levels=data.params.levels;params.rates=data.params.storage;let event;for(let e in params.events){event=params.events[e];if(event.matrix=='1'&&(event.overflow&&!event.is_leading)){params.events[e].type='leadingPlacePurchase';}}
writeByContainer(params.events);});socket.on('resetEvents',function(status){});socket.on('error',function(err){notify(err);});alertByEvent();function alertByEvent(){setInterval(function(){if(params.container.wrapper.css('display')=='block'){return;}
if(!params.events||params.events.length==0){notify('empty variable "params.events"');return;}
messageIteration('init');let event=null;let events=params.events.slice(-3);for(let e in events){if(params.messageIteration<events[e].id){event=events[e];break;}}
if(event){let msg=createMessage(event)
params.container.cell.html(`<img src="/img/icons/${params.eventsTypeIcon[event.type]}" alt="" class="alert-socket__img"> ${msg} <div data-elapse_time="${event.time1}" class="elapsedTime"></div>`)
params.container.cell.show(500,function(){setTimeout(function(){params.container.cell.hide(500);params.container.cell.empty();},2500);});messageIteration('set',event.id);}},params.delay);}
function writeByContainer(events){let event,msg;for(let i=0;i<events.length;i++){event=events[i];if(!event.id){break;}
msg=createMessage(event);let el=params.container.el;let item=el.find('li:first-child').data('alert_item');if(!item||item<event.id){el.prepend(`<li data-alert_item="${event.id}"><img src="/img/icons/${params.eventsTypeIcon[event.type]}" alt="" class="alert-socket__img"> ${msg} <div data-elapse_time="${event.time1}" class="elapsedTime"></div></li>`);if(!params.container.btn.hasClass('pulse')){params.container.btn.addClass('pulse')}
setTimeout(function(){params.container.btn.removeClass('pulse')},2000);for(let i=el.find('li').length;i>params.container.countItems;i--){el.find('li:last-child').remove();}}else{}}}
function createMessage(event){let msg;msg=params.message[event.type];if(Array.isArray(msg)){msg=msg[Math.floor(Math.random()*msg.length)];}
msg=msg.replace('{up_id}',event.up_id);msg=msg.replace('{ref_id}',event.r_id);msg=msg.replace('{u_id}',event.u_id);msg=msg.replace('{user_id}',event.user_id);msg=msg.replace('{crypto_name}','ETH');msg=msg.replace('{level}',event.level);if(event.matrix>0){msg=msg.replace('{price_level}',parseFloat(params.levels[event.matrix][event.level]));msg=msg.replace('{currency_usd}',parseFloat(params.rates.eth*params.levels[event.matrix][event.level]).toFixed(2));}
switch(event.matrix){case '1':msg=msg.replace('{matrix}','X3');break;case '2':msg=msg.replace('{matrix}','X4');break;default:msg=msg.replace('{matrix}','?');}
return msg;}
function messageIteration(action,key){if(action=='init'){params.messageIteration=cookie('messageIteration');}
if(action=='set'){params.messageIteration=key;cookie('messageIteration',params.messageIteration,{expires:2592e6});}}
function notify(msg){console.log('JS WebSocket: ',msg);}}
function storageTrigger(key,defaultValue){let val=storage(key);if(val=='0'){val='1';}else{val='0';}
return storage(key,val,defaultValue);}
function storage(key,val,defaultValue){let storage=getCookie('storage');if(!storage){storage={};}else{storage=JSON.parse(storage);}
if(val){if(!storage.hasOwnProperty(key)){val=defaultValue?1:0;}
storage[key]=val;setCookie('storage',JSON.stringify(storage),{expires:31104e3});return val;}
return storage.hasOwnProperty(key)?storage[key]:null;}
function cookie(key,val,opts){if(val){return setCookie(key,val,opts)}
return getCookie(key);}
function getCookie(name){let matches=document.cookie.match(new RegExp("(?:^|; )"+name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));return matches?decodeURIComponent(matches[1]):undefined;}
function setCookie(name,value,options={}){let defaultOptions={path:'/',};options=Object.assign(defaultOptions,options);if(options.expires instanceof Date){options.expires=options.expires.toUTCString();}else{if(options.expires){options.expires=new Date(Date.now()+Number.parseInt(options.expires));}}
let updatedCookie=encodeURIComponent(name)+"="+encodeURIComponent(value);for(let optionKey in options){updatedCookie+="; "+optionKey;let optionValue=options[optionKey];if(optionValue!==true){updatedCookie+="="+optionValue;}}
document.cookie=updatedCookie;}
(function(){'use strict';$('[data-trigger_value]').click(function(){let el,sib,out,val,res;el=out=$(this);if(el.find('span').length){out=el.find('span');}
val=el.data('trigger_value').split('|');if(out.text()==val[0]){res=val[1];}else{res=val[0];}
out.text(res);sib=el.data('trigger_value_siblings');if(sib){sib=$(sib);if(sib.find('span').length){sib=sib.find('span');}
sib.text(res);}});$('[data-spoiler]').click(function(){let key=$(this).data('spoiler');$(key).slideToggle();});window.l=function l(key){if(!config.lang||!config.lang.hasOwnProperty(key)){return 'no translate';}
return config.lang[key];};window.copyText=function(value){var s=document.createElement('input');s.value=value;document.body.appendChild(s);if(navigator.userAgent.match(/ipad|ipod|iphone/i)){s.contentEditable=true;s.readOnly=false;var range=document.createRange();range.selectNodeContents(s);var sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);s.setSelectionRange(0,999999);}
else{s.select();}
try{document.execCommand('copy');Notice.success(l('copied'));}
catch(err){Notice.error('Copied error: '+err.message);}
s.remove();};jQuery.fn.elapsedTime=function(selector,source,options={}){var options=jQuery.extend({lang:{years:['год','года','лет'],months:['месяц','месяца','месяцев'],days:['день','дня','дней'],hours:['час','часа','часов'],minutes:['минута','минуты','минут'],seconds:['секунда','секунды','секунд'],end:" назад",freshly:"только что",},plurar:function(n){return(n%10==1&&n%100!=11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2);},intervalUpdate:1,},options);options.intervalUpdate*=1e3;var timeDifference=function(end,begin){if(end<begin){return false;}
var difference={seconds:[end.getSeconds()-begin.getSeconds(),60],minutes:[end.getMinutes()-begin.getMinutes(),60],hours:[end.getHours()-begin.getHours(),24],days:[end.getDate()-begin.getDate(),new Date(begin.getYear(),begin.getMonth()+1,0).getDate()],months:[end.getMonth()-begin.getMonth(),12],years:[end.getYear()-begin.getYear(),0]};if(difference.years[0]!=0){delete(difference.days);delete(difference.hours);delete(difference.minutes);delete(difference.seconds);}
else if(difference.months[0]!=0){delete(difference.hours);delete(difference.minutes);delete(difference.seconds);}
else if(difference.days[0]!=0){delete(difference.minutes);delete(difference.seconds);}
else if(difference.hours[0]!=0){delete(difference.seconds);}
else if(difference.minutes[0]!=0){delete(difference.seconds);}
var result=new Array();var flag=false;for(let i in difference){if(flag){difference[i][0]--;flag=false;}
if(difference[i][0]<0){flag=true;difference[i][0]+=difference[i][1];}
if(!difference[i][0]){continue;}
result.push(difference[i][0]+' '+options.lang[i][options.plurar(difference[i][0])]);}
return result.reverse().join(' ');};var elapsedTime=function(){var need_to_time_update=$(selector);if(need_to_time_update.length>0){need_to_time_update.each(function(i){var date=need_to_time_update.eq(i).attr(source).toString().split(",");if(!date[5]){date[5]=0;}
var s=timeDifference(new Date(),new Date(date[0],date[1]-1,date[2],date[3],date[4],date[5]));if(s.length){need_to_time_update.eq(i).html(s+options.lang.end);}
else{need_to_time_update.eq(i).html(options.lang.freshly);}});}};elapsedTime();setInterval(elapsedTime,options.intervalUpdate);};$("body").elapsedTime('.elapsedTime','data-elapse_time',{lang:{years:[l('elt-years_0'),l('elt-years_1'),l('elt-years_2')],months:[l('elt-months_0'),l('elt-months_1'),l('elt-months_2')],days:[l('elt-days_0'),l('elt-days_1'),l('elt-days_2'),],hours:[l('elt-hours_0'),l('elt-hours_1'),l('elt-hours_2'),],minutes:[l('elt-minutes_0'),l('elt-minutes_1'),l('elt-minutes_2'),],seconds:[l('elt-seconds_0'),l('elt-seconds_1'),l('elt-seconds_2'),],end:l('elt-end'),freshly:l('elt-freshly'),}});})();