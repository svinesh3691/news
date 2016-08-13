<div class="swiper-container">
    <div class="swiper-wrapper">
            <% console.log(T.newses); for(var i=0; i < T.newses.length; i++) {  %>
                    <div class="swiper-slide app-swiper" data-hash="{{T.newses[i].news_id}}">

                            <div class="app-img">
                                <img class="img-tag" src="{{T.api_base_url}}/assets/news_images/{{T.newses[i].news_image}}">
                            </div>
                            <div class="app-con">
                                  <div class="app-head">55 of 57 newly-elected RS members are crorepatis</div>
                                  <div class="app-news">{{T.newses[i].news_body}}</div>
                                  <div class="app-by">short by Ankur Vyas / 
                                    <%
                                      var date = new Date(T.newses[i].news_add_date);
                                      console.log(date);
                                    %>
                                    {{date.getDate()}}-{{parseInt(date.getMonth()+1)}}-{{date.getFullYear()}} 
                                    at
                                    <%
                                      var hours = date.getHours();
                                      var minutes = date.getMinutes();
                                      var ampm = hours >= 12 ? "pm" : "am";
                                      hours = hours % 12;
                                      hours = hours ? hours : 12;  
                                      minutes = minutes < 10 ? "0"+minutes : minutes;
                                      var strTime = hours + ":" + minutes + " " + ampm;
                                    %>
                                    {{strTime}}
                                  </div>
                                  <div class="app-more">read more at Hindustan Times</div>

                            </div> 
                    </div>
            <% } %>
    </div>
</div>