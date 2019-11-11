// ============ LOAD DASH

var html='  <li> \
                    <a href="name"> \
                        <i class="logo"></i> \
                        <p>name</p> \
                    </a> \
                </li>'
                
var user='  <li class="active-pro"> \
                    <a> \
                        <i class="pe-7s-rocket"></i> \
                        <p id="hi_user">Welcome</p> \
                    </a> \
                </li>'
                
var request2 = new XMLHttpRequest()
request2.open('GET', '/api/dashboard_item', true);
request2.onload = function () {
    var obj = JSON.parse(this.response);
    var temp_html="";
    obj.forEach(function(e) {
        if (window.location.href.includes(e.name)){
            temp_html += html.replace("name",e.name).replace("name",e.name).replace("logo",e.icon).replace("<li>","<li class=\"active\">");
        }else{
            temp_html += html.replace("name",e.name).replace("name",e.name).replace("logo",e.icon);
        }
    });
    temp_html += user
    document.getElementById('dash').innerHTML = temp_html;
    var request = new XMLHttpRequest()
    request.open('GET', '/api/current_user', true);
    request.onload = function () {
        var obj = JSON.parse(this.response);
        document.getElementById('hi_user').innerHTML = 'Hello ! ' + obj[0].name;
    }
    request.send();
}
request2.send();





setInterval(function(){
    var d = document.getElementById('datetime');
    var time = new Date();
    var month = new Array();
    var hour = time.getHours() ;
    var minute = time.getMinutes();
    month[0] = "January";   month[1] = "February";      month[2] = "March";
    month[3] = "April";     month[4] = "May";               month[5] = "June";
    month[6] = "July";      month[7] = "August";           month[8] = "September";
    month[9] = "October";   month[10] = "November";   month[11] = "December";
    var d_m = time.getMonth();
    var output = time.getDate() + ' - ' + month[d_m] + ' (' + hour + ':' + lead_z(minute) + ')';
    d.innerHTML = output;
    
}, 1000);




function lead_z(dt) {return (dt < 10 ? '0' : '') + dt;}
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}