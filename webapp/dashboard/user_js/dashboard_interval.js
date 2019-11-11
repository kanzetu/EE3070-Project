var request = new XMLHttpRequest()

setInterval(function(){
    request.open('GET', '/api/rpi_temp', true)
    request.onload = function () {
        val = 'CPU Temp: '
        document.getElementById('rpi_temp').innerHTML = val + this.response + '°C';
    }
    request.send()
},1000);

setInterval(function(){
    var request2 = new XMLHttpRequest();
    request2.open('GET', '/api/sysmemory', true);
    request2.onload = function () {
        var obj = JSON.parse(this.response);
        document.getElementById('mem_detail').innerHTML = '<i class="fa fa-history"></i>' + " Buffcache: " + formatBytes(obj.buffcache) + " Available: " + formatBytes(obj.available);
        free = Math.round(obj.free/obj.total*100* 100)/100;
        used = Math.round(obj.used/obj.total*100* 100)/100;
        var ctx = document.getElementById("chartPreferences").getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: [used, free],
                    backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"]
                }],
                labels: [used + '%', free + '%']
            },
            options: {
                animation: {
                    duration: 0
                }
            }
        });
    }
    request2.send()
},1000);


// ON Loaded



var request3 = new XMLHttpRequest();
request3.open('GET', '/api/sql_rpi_temp', true);
request3.onload = function () {
    var time = [];
    var temp = [];
    var obj = JSON.parse(this.response);
    obj.forEach(function(e) {
        time.push(e.time);
        temp.push(e.temp);
    });
    var ctx = document.getElementById("tempHours").getContext('2d');
    var color = Chart.helpers.color;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: time,
            datasets: [{
                label: "Temperature",
                lineTension: 0,
                borderWidth: 2,
                type: 'line',
                fill: false,
                pointRadius: 0,
                borderColor: '#ff3333',
                backgroundColor: '#ff3333',
                data: temp
            }]
        },
        options: {
            tooltips:{
                intersect: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return moment.utc(value).local().format('LT')
                        }
                    }
                }]
            }
        }
    });
    
    var i = temp.indexOf(Math.max(...temp));
    document.getElementById('max_temp').innerHTML = '<i class="fa fa-history"></i>' + "Max Temp: " + temp[i] + "°C at " + time[i];
}
request3.send();



request.open('GET', '/api/sysmemory', true)
request.onload = function () {
    var obj = JSON.parse(this.response);
    document.getElementById('num_of_ram').innerHTML = "RAM: " + formatBytes(obj.total) +"   " + "Swap: " + formatBytes(obj.swaptotal);
}
request.send()

var request4 = new XMLHttpRequest();
request4.open('GET', '/api/syscpu', true);
request4.onload = function () {
    var obj = JSON.parse(this.response);
    document.getElementById('os_type').innerHTML = obj.distro + ' (' + obj.hostname + ')';
    document.getElementById('os_ver').innerHTML = 'Version: ' + obj.codename + ' (' + obj.release + ')';
    document.getElementById('os_kernel').innerHTML = 'Kernel: ' + obj.kernel;
    document.getElementById('os_arch').innerHTML = 'CPU model: ' + obj.manufacturer +' ' + obj.brand;
    document.getElementById('os_clock').innerHTML = 'CPU clock: (Min)' + obj.speedmin +' / (Max)' + obj.speedmax;
    document.getElementById('os_serial').innerHTML = 'Serial: ' + obj.serial;
    document.getElementById('uptime').innerHTML = 'Uptime: ' + obj.uptime;
}
request4.send();

var request5 = new XMLHttpRequest();
request5.open('GET', '/api/sysdisk', true);
request5.onload = function () {
    var obj = JSON.parse(this.response);
    var used = obj[0].used;
    var free = obj[0].size - obj[0].used;
    var ctx = document.getElementById("chartDiskPreferences").getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [Math.round(free/obj[0].size*100* 100)/100, Math.round(used/obj[0].size*100* 100)/100],
                backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"]
            }],
            labels: [formatBytes(free,2), formatBytes(used,2)],
        }
    });
    document.getElementById('total_disk').innerHTML = 'Total: ' + formatBytes(obj[0].size); 
}
request5.send();


function formatDate(date) {return moment(date).format('YYYY-MM-DD HH:mm:ss');}
function lead_z(dt) {return (dt < 10 ? '0' : '') + dt;}
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}