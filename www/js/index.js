/*The configurations*/
var C = {
    'name'  : 'Get Me Hot News',
    'db'    : {
                'Name'         : 'GMHN',
                'Version'      : '1.0',
                'DisplayName'  : 'GMHN DB',
                'MaxSize'      : 65535
    },
    'app_version' : '1.0.0',
    // 'api_site_url' : 'http://localhost/OFC/svinesh3691/news_app_admin/api/index.php/',
    // 'api_site_url' : 'http://192.168.43.231/OFC/svinesh3691/news_app_admin/api/index.php/',
    // 'api_base_url' : 'http://192.168.43.231/OFC/svinesh3691/news_app_admin/api/'
    'api_site_url' : 'http://demo.vintechnosys.com/news/api/index.php/',
    'api_base_url' : 'http://demo.vintechnosys.com/news/api/'
}

/*Seven*/
var seven = new Framework7({
                    modalTitle: 'Alert',
                    material: true, // Enable Material theme
});

/*The common app functions*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // Back Button Management
        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
            var exit_confirm = confirm('Are you sure to exit app? ');
            if(exit_confirm) navigator.app.exitApp();
        }, false );   
    },   
};

/*DB Class - mysql lite */
function dbClass() {
    this.db = {};
    var Tfns = this;
    this.createDatabase = function() { 
                try {
                    if (!window.openDatabase) {
                        alert('Database not supported');
                    } else {
                        this.db = openDatabase(C.db.Name, C.db.Version, C.db.DisplayName, C.db.MaxSize);
                    }
                    return true
                } catch(e) {
                    if (e == 2) {
                        alert("Invalid database version.");
                    } else {
                        alert("Unknown error "+e+".");
                    }
                    return false;
                }
    }

    // Creating the table
    this.createTables   = function() { 

            var news_table_query    = 'CREATE TABLE IF NOT EXISTS news_main (news_id int,news_title TEXT,news_body TEXT,news_image TEXT, news_type int, news_from TEXT ,news_from_link TEXT, news_by_name TEXT, news_status int, news_add_date DATE)';
            this.query(news_table_query,[],function(res) {
                // console.log(res);
            });

    }
    //Querying the db
    this.query  = function(query,parameters,callback) {
            this.db.transaction(function(tx){
                tx.executeSql(  query, parameters,
                                function(tx,result){
                                    callback({ 'code'  : 1, 'tx'    : tx, 'result': result });
                                },
                                function(error){
                                    callback({ 'code'  : 2, 'error' : error });
                                });
            },
            function(error){
                alert("Error processing SQL:"+error.code);
                alert("Error processing SQL:"+error.message);
            },
            function(success){
                    // console.log('success');
            });
    }
}

/*Push Class*/
var TpushService = {};
TpushService.push = function() {
                
            var push = PushNotification.init({
                "android": {
                    "senderID": "730309421478"
                },
            });

            push.on('registration', function(data) {
                var oldRegId = localStorage.getItem('registrationId');
                if (oldRegId !== data.registrationId) {
                    localStorage.setItem('registrationId', data.registrationId);
                    $.post(C.api_site_url+'push/register',{
                            id:data.registrationId
                    },function(res) {
                        localStorage.registrationId = data.registrationId;
                        localStorage.push = 1;
                    });
                }

            });

            push.on('error', function(e) {
                console.log("push error = " + e.message);
            });

            push.on('notification', function(data) { 
                TpushService.push_news(data.additionalData.coldstart,data.additionalData.id,data.title,data.message,data.additionalData.news_image,data.additionalData.news_type,data.additionalData.news_from,data.additionalData.news_from_link,data.additionalData.news_by_name,data.additionalData.news_status,data.additionalData.news_add_date);
            });
}
TpushService.push_news = function(colds_start,news_id,news_title,news_body,news_image,news_type,news_from,news_from_link,news_by_name,news_status,news_add_date) {
        var dbs = new dbClass();
        dbs.createDatabase();
        dbs.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_from,news_from_link,news_by_name,news_status,news_add_date) VALUES (?,?,?,?,?,?,?,?,?,?)', [news_id,news_title,news_body,news_image,news_type,news_from,news_from_link,news_by_name,news_status,news_add_date],function(res){
                if(colds_start == false) {
                    window.location.href = "";
                } else if(colds_start == undefined) {
                    populateNews(dbs);
                    // localStorage.tillNow = news_id;
                    if(localStorage.notifyingUpdate == 0 ) {
                            localStorage.notifyingUpdate = 1;
                            seven.addNotification({
                                    message: 'New news/jobs updated...',
                                    onClose: function () {
                                        localStorage.notifyingUpdate = 0;
                                    }
                            });
                    }
                    
                }
        });
}



/*News Function*/
function populateNews(myDb) { 
    var T = {};
    T.newses = [];
    var days = ["ஞாயிறு","திங்கள்","செவ்வாய்","புதன்","வியாழன்","வெள்ளி","சனி"];
    myDb.query("DELETE FROM news_main WHERE news_add_date <= date('now','-3 day')",[],function(res){
            myDb.query('SELECT * FROM news_main ORDER BY `news_id` DESC',[],function(res){
                    for (var i = 0;k = res.result.rows.length, i< k; i++) {
                        var thisNews = res.result.rows.item(i);
                        dt = new Date(res.result.rows.item(i).news_add_date);
                        thisNews.news_add_dater =  new Date(res.result.rows.item(i).news_add_date);
                        T.newses.push(thisNews);
                    }
                    var template = '';
                    template += '<div class="swiper-container">';
                    template +=     '<div class="swiper-wrapper">';
                    for(var i=0; i < T.newses.length; i++) {
                    template +=                    '<div class="swiper-slide app-swiper" data-hash="'+T.newses[i].news_id+'">';

                    template +=                            '<div class="app-img">';
                    template +=                                '<img class="img-tag" onerror="this.src=\'hot_news.jpg\'" alt="Offline" src="'+C.api_base_url+'assets/news_images/'+T.newses[i].news_image+'">';
                    template +=                            '</div>';
                    template +=                            '<div class="app-con">';
                    template +=                                  '<div class="app-head">'+T.newses[i].news_title+'</div>';
                    template +=                                  '<div class="app-by">   ';
                                                        
                                                          var date = new Date(T.newses[i].news_add_date);
                                                        
                    template +=                              days[date.getDay()] +' '+     date.getDate()+'-'+parseInt(date.getMonth()+1)+'-'+date.getFullYear() +', '; 
                                                        'at';
                                                        
                                                          var hours = date.getHours();
                                                          var minutes = date.getMinutes();
                                                          var ampm = hours >= 12 ? "pm" : "am";
                                                          hours = hours % 12;
                                                          hours = hours ? hours : 12;  
                                                          minutes = minutes < 10 ? "0"+minutes : minutes;
                                                          var strTime = hours + ":" + minutes + " " + ampm;
                                                    
                    template +=                                    strTime;
                    template +=                                  '</div>';
                    template +=                                  '<div class="app-news">'+T.newses[i].news_body+'</div>';
                    template +=                                  '<div class="app-more"> முழு செய்தியறிய க்ளிக் <a class="hrf" href="'+T.newses[i].news_from_link+'"> '+T.newses[i].news_from+' </a> </div>';

                    template +=                            '</div>';
                    template +=                    '</div>';
                                }
                    template +=    '</div>';
                    template += '</div>';


                    document.getElementById('app').innerHTML = template;
                    var swiper = new Swiper('.swiper-container', {
                          pagination: '.swiper-pagination',
                          spaceBetween: 50,
                          observer : true,
                          hashnav: true
                    });
            });
    });
}
function fetchNews(myDb) {
    var tillNow = localStorage.tillNow || 0;
    $.post(C.api_site_url+'api/fetchNews',{
                'tillNow'       : tillNow
    },function(res) {
        if (res.news) {
                for (var i = 0 ; i < res.news.length; i++) { 
                            myDb.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_from,news_from_link,news_by_name,news_status,news_add_date) VALUES (?,?,?,?,?,?,?,?,?,?)', [res.news[i].news_id,res.news[i].news_title,res.news[i].news_body,res.news[i].news_image,res.news[i].news_type,res.news[i].news_from,res.news[i].news_from_link,res.news[i].news_by_name,res.news[i].news_status,res.news[i].news_add_date],function(res){
                                
                            });
                };
                localStorage.firstFetch = 1;
                localStorage.tillNow = res.news[res.news.length-1].news_id;
                populateNews(myDb);
        } else {
            populateNews(myDb);
        }
    });

}

function interNews(myDb) {
    var tillNow = localStorage.tillNow;
    $.post(C.api_site_url+'api/fetchNews',{
                'tillNow'       : tillNow,
    },function(res) {

        if (res.news) {

                myDb.query('SELECT news_id FROM news_main',[],function(resu){
                        var alr_newses = [];

                        for (var i = 0;k = resu.result.rows.length, i< k; i++) {
                            var thnews = resu.result.rows.item(i);
                            alr_newses.push(resu.result.rows.item(i).news_id);
                        }

                        for (var i = 0 ; i < res.news.length; i++) {
                                    if(alr_newses.indexOf(parseInt(res.news[i].news_id)) == -1) {
                                            insNewses(res.news[i],myDb);
                                    }
                                    localStorage.tillNow = res.news[res.news.length-1].news_id;
                        };
                        if(localStorage.notifyingUpdate == 0 ) {
                                localStorage.notifyingUpdate = 1;
                                seven.addNotification({
                                        message: 'New news/jobs updated...',
                                        onClose: function () {
                                            localStorage.notifyingUpdate = 0;
                                        }
                                });
                        }
                        

                });

               
        }
    });
}



function insNewses(news,myDb) {
            myDb.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_from,news_from_link,news_by_name,news_status,news_add_date) VALUES (?,?,?,?,?,?,?,?,?,?)', [news.news_id,news.news_title,news.news_body,news.news_image,news.news_type,news.news_from,news.news_from_link,news.news_by_name,news.news_status,news.news_add_date],function(res){
            });
            populateNews(myDb);
}


function isOnline(yes,no){
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');
    xhr.onload = function(){
        if(yes instanceof Function){
            yes();
        }
    }
    xhr.onerror = function(){
        if(no instanceof Function){
            no();
        }
    }
    xhr.open("GET",C.api_site_url+'api/getVersion',true);
    xhr.send();
}