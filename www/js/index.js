/*The configurations*/
var C = {
    'name'  : 'Get Me Hot News',
    'db'    : {
                'Name'         : 'GMHN',
                'Version'      : '1.0',
                'DisplayName'  : 'GMHN DB',
                'MaxSize'      : 65535
    },
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

            var news_table_query    = 'CREATE TABLE IF NOT EXISTS news_main (news_id int,news_title TEXT,news_body TEXT,news_image TEXT, news_type int, news_add_date DATE)';
            this.query(news_table_query,[],function(res){
                console.log(res);
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
            console.log('Initializing Push...');
                
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
                TpushService.push_news(data.additionalData.coldstart,data.additionalData.id,data.title,data.message,data.additionalData.news_image,data.additionalData.news_type,data.additionalData.news_add_date);
            });
}
TpushService.push_news = function(colds_start,news_id,news_title,news_body,news_image,news_type,news_add_date) {
        var db = new dbClass();
        db.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_add_date) VALUES (?,?,?,?,?,?)', [news_id,news_title,news_body,news_image,news_type,news_add_date],function(res){
                localStorage.tillNow = news_id;
                 if(colds_start == false) {
                    window.location.reload();
                 } else if(colds_start == undefined) {
                    populateNews();
                    alert('New news updated...'); 
                 }
        });
}


/*News Function*/
function populateNews(myDb) { 
    var T = {};
    T.newses = [];
    myDb.query('SELECT * FROM news_main ORDER BY `news_id` DESC',[],function(res){
            for (var i = 0;k = res.result.rows.length, i< k; i++) {
                var thisNews = res.result.rows.item(i);
                dt = new Date(res.result.rows.item(i).news_add_date);
                thisNews.news_add_dater =  new Date(res.result.rows.item(i).news_add_date);
                T.newses.push(thisNews);
            }
            console.log('allNewses');
            // var lib  = $_.library();
            // lib.$_makeTemplate('partials/news_list',{
            //         'newses' : newses, 
            //         'api_base_url' : C.api_base_url 
            //     },function(r){
            // console.log('r');
            // console.log(r);
            //         document.getElementById('app').innerHTML = r;
            //         var swiper = new Swiper('.swiper-container', {
            //               pagination: '.swiper-pagination',
            //               spaceBetween: 50,
            //               observer : true,
            //               hashnav: true
            //         });
            // });


            var template = '';
            template += '<div class="swiper-container">';
            template +=     '<div class="swiper-wrapper">';
            for(var i=0; i < T.newses.length; i++) {
            template +=                    '<div class="swiper-slide app-swiper" data-hash="'+T.newses[i].news_id+'">';

            template +=                            '<div class="app-img">';
            template +=                                '<img class="img-tag" src="'+C.api_base_url+'/assets/news_images/'+T.newses[i].news_image+'">';
            template +=                            '</div>';
            template +=                            '<div class="app-con">';
            template +=                                  '<div class="app-head">55 of 57 newly-elected RS members are crorepatis</div>';
            template +=                                  '<div class="app-news">'+T.newses[i].news_body+'</div>';
            template +=                                  '<div class="app-by">short by Ankur Vyas / ';
                                                
                                                  var date = new Date(T.newses[i].news_add_date);
                                                
            template +=                                    date.getDate()+'-'+parseInt(date.getMonth()+1)+'-'+date.getFullYear(); 
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
            template +=                                  '<div class="app-more">read more at Hindustan Times</div>';

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
}
function fetchNews(myDb) {
    console.log('fetch')
    var tillNow = localStorage.tillNow || 0;
    console.log(C.api_site_url+'api/fetchNews')
    $.post(C.api_site_url+'api/fetchNews',{
                'tillNow'       : tillNow
    },function(res) {
        console.log('res');
        if (res.news) {
                for (var i = 0 ; i < res.news.length; i++) { 
                            myDb.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_add_date) VALUES (?,?,?,?,?,?)', [res.news[i].news_id,res.news[i].news_title,res.news[i].news_body,res.news[i].news_image,res.news[i].news_type,res.news[i].news_add_date],function(res){
                                console.log(res);
                            });
                };
                localStorage.tillNow = res.news[res.news.length-1].news_id;
                populateNews(myDb);
        } else {
            populateNews(myDb);
        }
    });

}
