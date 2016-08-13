(function(dt,ww){

      // module-name, controller-name, action-name, method-name, aidOldClass[obj],
      // controller, instance, aidMixin[obj]
      var  module, controller, actionName, method, aidOldClass={};
      var  _v,aidMixin={};
      var  aidModule = {};
      var  _aid;

      var Dependencies;   // The Dependency array
      var Includes;       // The Includes count
      var C               // The Controller
      var className       // The name of class

      var aid = function (t) {
          _v = this; if(t) aid.prototype.$_config = t; //setting the config for framework mode
      }
      
      /***********************************************************************
       * Method Name : $_when [Public Method] 
       * Description : The event listeners
       #======================================================================*/
      aid.prototype.$_when = new function when(){}; 

      /***********************************************************************
       * Method Name : $_run [Public Method] 
       * Description : To start running aid app
       * params      : function [if any]
       #======================================================================*/
      aid.prototype.$_run  = function (fn) {
            if (!_v.$_config) return cE('Aid warning: Run method is not to be used in library mode');
            if (fn) fn();
            Dependencies = {}; //Initializing dependencies to an empty object
            if (!_v.$_config.defaultRoute) return cE("Aid Error: No 'defaultRoute' set.\n Set it this way :  app.config.set('defaultRoute','yourDefaultRoute');");
            ( (ww.location.hash == "") || (ww.location.hash == "#/") || (ww.location.hash == "#")) && (_v.$_hashLoad(_v.$_config.defaultRoute) ); 
            _v.router();
            ww.onhashchange = function(){_v.router();} 
      }

      /***********************************************************************
       * Method Name : $_bootstrap [Public Method] 
       * Description : To bootstrap the aid app
       * params      : function
       #======================================================================*/
      aid.prototype.$_bootstrap = function (fn) {
          // Bootstrap function
          ((fn) && fn.apply(new boot()));
      }

      /***********************************************************************
       * Method Name : boot [Private Method] 
       * Description : To bootstrap the app
       * params      : null
       #======================================================================*/
      var boot = function () {};
      /***********************************************************************
       * Methods Name : $_use,$_setConfig,$_delConfig [Public Methods - boot ] 
       * Description  : Used to load external modules, set and delete configs
       #======================================================================*/
      boot.prototype.$_use = function (a) {
            if (typeof(a) != 'object') return cE('Aid Notice : Unacceptable parameter in `$_use` function which allows a single array as its parameter ' );
            for (var i=0; i < a.length; i++) {
                  if ((aidModule[a[i]]) && typeof(aidModule[a[i]] == 'function' ) ) 
                  $_.prototype[a[i]] = aidModule[a[i]];
                  else cE('Aid Notice : Trying to load a non existing module `'+a[i]+'`');
            }
      }
      boot.prototype.$_setConfig     = function (key,val) {
              // setting config
              return _v.$_config.__proto__[key] = val;
      }
      boot.prototype.$_delConfig     = function (key) {
              // delete config
              if (key && _v.$_config[key]) return  delete _v.$_config[key]; else return false;
      }

      /***********************************************************************
       * Method Name : router [Public Method] 
       * Description : Observe the routes and assign the class and route
       #======================================================================*/
      aid.prototype.router = function () {
              if(_v.$_when.hashChangeStart) _v.$_when.hashChangeStart(); 
              
              var hash            = ww.location.hash; 
              var route           = hash.replace("#/", "").split('/');
              var argumentArray   = route.splice(2);
              
              if(route[0] == "") return;
              
              className           = route[0];
              var routeName       = route[1] || 'index';
              includes            = 0; //setting include count to zero

              routeTo(className,routeName,argumentArray); 
      }

      /***********************************************************************
       * Method Name : routeTo [private Method]
       * Description : Used by 'router' method to route
       * params      : class [string], route [string], arguments [array]
       #======================================================================*/
      var routeTo = function (className, routeName, argumentArray) {
              loadClass(function() {
                    // Setting current controller instance as `C`  
                    if (_v[className]) C = new _v[className];
                    else {
                        if (_v.$_when.hashChangeError) _v.$_when.hashChangeError('class');
                        return cE('Aid Error: Unable to intialize the class `'+ className +'`');
                    }
                    _v.$_shadowRoute(className, routeName, argumentArray, true);
              }, className, routeName, argumentArray);
      }

      /***********************************************************************
       * Method Name : $_shadowRoute [public Method]
       * Description : A part of routing process
       * params      : actionName [string], arguments [array], direct [boolean]
       #======================================================================*/
      aid.prototype.$_shadowRoute = function (className, routeName, argumentArray, notdirect) {
              if (!notdirect) {
                  actionName = action || 'index';
                  var o = { 'controller': controller, 'action': actionName, 'arguments': argumentArray, 'type': 'shadowRoute'};
                  if (_v.$_when.hashChangeStart) _v.$_when.hashChangeStart(o);
              }  
              if ( C[routeName+'Route'] ) {
                  if (notdirect && _v.$_when.hashLoadStart) _v.$_when.hashLoadStart(o);
                  var depend = dependFetch(className, 'Route', routeName, argumentArray);
                  if (depend) C[routeName+'Route'].apply(C,depend);
              } else {
                if (_v.$_when.hashChangeError) _v.$_when.hashChangeError('route');
                return cE('Aid Error: Route `'+routeName+'Route` not found in `'+className+'` class');
              }
              dt.body.scrollTop = dt.documentElement.scrollTop = 0;
              if (_v.$_when.hashChangeEnd) _v.$_when.hashChangeEnd();
      }

      /***********************************************************************
       * Method Name : dependFetch [private Method]
       * Description : For fetching dependencies
       * params      : controller, route/controller, route/controller name, arguments
       #======================================================================*/
      var dependFetch = function (className, route_controller, route_controller_name, argumentArray) {
            var depend = [];
            var dependency = [];
            dependency = Dependencies[className][route_controller_name+route_controller];
            if(!dependency) {
                if ( (C.$_inherits) && (C.$_inherits.length != 0) ) {
                    for (var i = C.$_inherits.length - 1; i >= 0; i--) {
                        if(Dependencies[C.$_inherits[i]][route_controller_name+route_controller]) {
                            dependency = Dependencies[C.$_inherits[i]][route_controller_name+route_controller];
                            break;
                        }
                    }
                }
            }
            if (dependency) {
                  for (var i=0; i < dependency.length; i++) {
                      if (aidMixin[dependency[i]]) depend.push(aidMixin[dependency[i]]);
                      else {
                          cE('Aid Error: Trying to inject a unknown dependency `'+dependency[i]+'`');
                          return false;
                      }
                  }
            } else {
              console.warn('No depend');
            }
            depend.unshift(argumentArray);
            return depend;
      }

      /***********************************************************************
       * Method Name : hashLoad [Public Method] 
       * Description : Manages the window.location.href
       * params      : route(optional)
       #======================================================================*/
      aid.prototype.$_hashLoad = function (route) {
        if (route==undefined) _v.router();
        else ww.location.href = '#/'+route; 
      }
      
      /***********************************************************************
       * Method Name : template [Public Method]
       * Description : 
       * params      : 
       #======================================================================*/
      aid.prototype.$_makeTemplate = function (page,model,callback) { 
            ajax("GET", page+'.tpl', true,function(r){
        console.log('gv')

                    gV(r.responseText,false,model,false,[],true,callback);
            });
      }

      /***********************************************************************
       * Method Name : $_class [Public Method]
       * Description : Used to register a class
       * params      : name (string), function, classes to inherit (array)
       #======================================================================*/
      aid.prototype.$_class = function (n,f,h) {
          var p={},a,e,q;
          a = new aidClass();
          if(h) e = inherit(h); // Inheriting.........
          for (v in a)  p[v] = a[v]; // Assigning the aid controller protos
          if(e) for (v in e)  p[v] = e[v]; // Assigning the inherited protos
          (_v[n] = f)&&
          (_v[n].prototype = p)&&
          (_v[n].prototype.constructor = f)&& 
          (_v[n].prototype.$_inherits = h)&& 
          (p = {});
      }
      
      /***********************************************************************
       * Method Name : $_method [Public Method]
       * Description : Used to add method to the class
       * params      : class name, method name, the function, dependencies
       #======================================================================*/
      aid.prototype.$_method = function (className, methodName, theFunction, dependencyArray) { 
              if (_v[className]) {
                      // Assign the method to the class [as Prototype]
                      _v[className].prototype[methodName] =  theFunction;
                      // If Dependency array is absent for the class then make it
                      if (!Dependencies[className]) Dependencies[className] = {};
                      // Assign the dependency
                      Dependencies[className][methodName] = dependencyArray;
              } 
              else cE('Aid Error :Trying to add method to a non existing class `'+className+'`');
      }


      /***********************************************************************
       * Method Name : createMixin [Public Method]
       * Description : Used to create a aid class
       * params      : class name (string), clases to inherit (array), function
       #======================================================================*/
      aid.prototype.$_mixin = function (n,f) {
            if (typeof(f) == 'function') aidMixin[n] = new f(); 
            else aidMixin[n] = f;
      }

      var cE = function(e) {
        return console.error(e);
      }
      var cL = function(e) {
        return console.log(e);
      }
      var cW = function(e) {
        return console.warn(e);
      }
    
      /***********************************************************************
       * Method Name : inherit [Private Method]
       * Description : Used to inherit classes
       * params      : classes (array)
       #======================================================================*/
      var inherit = function (h,m) {
            var p={},i,k,v,r,o; 
            var re = function (n) {
                if(m) o = 'Mixin'; else o = 'Class';
                cE('Aid Error : '+o+' `'+n+'` is not registered in aid'); 
            }
            for (i=h.length-1; i >= 0; i--) {
                if (m)  if (k = aidMixin[h[i]])  p[h[i]] = aidMixin[h[i]]; else re(h[i]);
                else   if ( (_v[h[i]]) && (k = new _v[h[i]]()) ) for (v in k)  p[v] = k[v]; else re(h[i]); 
            }
            return p;
      }

      /***********************************************************************
       * Method Name : loadController [private Method]
       * Description : Used by 'router' method to load the controller
       * params      : controller name (string), callback (function)
       #======================================================================*/
      var loadClass = function (callback, className, routeName, argumentArray) {
          if (_v.$_when.hashLoadStart) 
          _v.$_when.hashLoadStart({
                    'class'      : className,
                    'route'      : routeName,
                    'arguments'  : argumentArray,
                    'type'       : 'directRoute'
          });
          
          if (_v[controller]) { 
            callback();  return; 
          }
          
          var url = _v.$_config.classUrl+className+".js";
          loadScript(url, callback, className);
      }

      /***********************************************************************
       * Method Name : loadScript [Private Method]
       * Description : For internal script loading
       * params      : url,callback
       #======================================================================*/
      var loadScript = function (url,b,className) {
            var script = dt.createElement("script"); script.type = "text/javascript"; script.src = url;
            if(script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                      script.onreadystatechange = null; b();
                    } else {
                        if (_v.$_when.hashChangeError) _v.$_when.hashChangeError('controller');
                        return console.error('Aid Error: Unable to load the class `'+ className +'`');
                    }
                };
            } else {
                script.onload = function() {
                    b();
                };
                script.onerror = function () {
                     if (_v.$_when.hashChangeError) _v.$_when.hashChangeError('controller');
                     return console.error('Aid Error: Unable to load the class `'+ className +'`');
                }
            }
            dt.getElementsByTagName("head")[0].appendChild(script);
      }

      /***********************************************************************
       * Method Name : aidController [Private Method]
       * Description : The basic controller class
       * params      : NULL
       #======================================================================*/
      var aidClass = function() {
            var _c = this;  
            var $_d = {};
          
            /*=====================================================
            Method Name : model [Public Method]
            Use to send data to views
            data object
            ******************************************************/
            _c.$_model = function (o) {  
                         $_d = o; 
            }
          
            /*=====================================================
            Method Name : view [Public Method]
            Use to render the view by controller
            page-url,destination,script-parameters
            ******************************************************/
            _c.$_view = function (page,container,scriptParameters) {
                if (!scriptParameters) scriptParameters = [];
                if (_v.$_config) var tpl = _v.$_config.viewUrl+page;
                else var tpl = page;
                ajax('GET', tpl+'.tpl', true,function(res){
                     gV(res.responseText,container,$_d,scriptParameters); 
                });
            }


            _c.$_mvc = function (m, v, c) {
                  $_d = m;
                  if (!c) c = [];
                  if (!v[2]) v[2] = [];
                  if (_v.$_config) var tpl = _v.$_config.viewUrl+v[0];
                  else var tpl = v[0];
                  ajax('GET', tpl+'.tpl', true, function(res){
                      gV(res.responseText, v[1] ,$_d ,c[0] ,c[1]); 
                  });
            }
      }

      /***********************************************************************
       * Method Name : ajax [Private Method]
       * Description : For internal ajax calls
       * params      : mode, url, async, callback
       #======================================================================*/ 
      function ajax(m,u,f,c) {
        //       var r = new XMLHttpRequest();
        //       r.open(m, u, f);
        //       r.onreadystatechange = function () {
        // console.log('gv')
        // console.log(u);
        // console.log(r.status);
        //           if (r.readyState != 4 || r.status != 200) return; 
        //           c&&c(r);
        //       };

        //       r.send();

        var client = new XMLHttpRequest();
        client.open('GET', u);
        client.onreadystatechange = function() {
          console.log(client.status);
        }
        client.send();


      }

      /***********************************************************************
       * Method Name : Related to view generation [Private Methods]
       * Description : Used by 'view' method to compile the view
       * params      : view,destination,model,parmeterofcallback,return html,callback
       #======================================================================*/
      /*GenView*/      
      function gV(HTMLs, container, $_d, controller, scriptParameters, returnHTML, callback) {
            
            eV(HTMLs, $_d);
            if (returnHTML){callback(ht); return;}
            if (container) dt.getElementById(container).innerHTML = ht; 
            else return cL('No destination found!');
            iN($_d, controller, scriptParameters);
      }
      /*genSuprememe*/
      var gS = function(v) {
            var re = /<!--([^%>]+)?-->/g, match;
            while(match = re.exec(v)) {
                v = v.replace(match[0], '');
            }
            v = v.replace(/'/g , "\\'" ).replace(/\[\\'/g , '["' ).replace(/\\'\]/g , '"]' ).replace(/{{/g, "'+").replace(/}}/g, "+'" ).replace(/%=/g , "ht+=" ).replace(/<%/g , "';" ).replace(/%>/g, "ht+='").replace(/(\r\n|\n|\r)/gm,'');
            return "var T = this;ht='"+v+"';";
      }
      /*genInclude*/ //element,model,callback,total-icludes,two-way
      var gI = function(o,m,b,n,t) {
              ajax("GET", o.getAttribute("url"), true, function(x) {
                        v  = x.responseText;
                        eV(v,m);
                        o.innerHTML = ht; 
                        if (n == ++includes){
                          if (C[method+'_script']) new C[method+'_script'];
                          (_v.$_when.hashLoadComplete) && (_v.$_when.hashLoadComplete());
                        }
              });
      }
      /*Include*/  // model,parameter
      var iN = function ($_d, controller, scriptParameters) {
                includes = 0;
                z = dt.getElementsByTagName("x-a-include");
                if (z.length==0) {
                    if (controller) {
                        if ( (C[controller+'Controller']) ) {
                              var depend = dependFetch(className,'Controller',controller,scriptParameters);
                              if (!depend) return;
                              // depend.unshift(C);
                              ww.T =  C[controller+'Controller'].apply(C,depend);
                        } else {
                            cE('Aid Error: Controller `'+controller+'Conntroller` not found in class `'+className+'`');
                        }
                    }
                    if(_v.$_when.hashLoadComplete) _v.$_when.hashLoadComplete();
                } 
                for (i = 0; i < z.length; i++)  new gI(z[i],m,b,z.length,t); 
      }
      /*Evaluate*/  // view,model
      var eV = function (HTMLs,$_d) {
            new Function(gS(HTMLs)).call($_d);
      }


      aid.prototype.execute = function (c,mtd,para) {
          C = new _v.controllers[c];
          if(C[mtd])  C[mtd].apply(C,para); 
          else return cE('Aid Error: Method `'+mtd+'` not found in `'+r[1]+'` class');
      }
      aid.prototype.process = function (id,p,b) { 
            var html = dt.getElementById(id).innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            console.log(html);
            gV(html,id,function(p){b&&b(p)},p,false,false);
      }
               

      /*Start AID Functions*/
      var $_ = function () {};
      $_.prototype.version = '1.0.0';
      $_.prototype.framework = function() {
              function config(){};
              config.prototype.moduleUrl      = 'app/modules/';
              config.prototype.controllerUrl  = 'app/controllers/';
              config.prototype.viewUrl        = 'app/views/';
              config.prototype.mixinUrl       = 'app/mixins/';
              config.prototype.classUrl       = 'app/classes/';
              _aid = new aid(new config()); 
              return _aid;
      }
      $_.prototype.library = function() {
              var app =  new aid();
              app.controllers = {};
              return app;
      }
      $_.prototype.emptyObject = function(obj) {
                      for(var prop in obj) if(obj.hasOwnProperty(prop)) return false;
                      return true;
      }
      $_.prototype.ajax = function(m,u,d,c) {
                  var r = new XMLHttpRequest();
                  d = JSON.stringify(d);
                  r.open(m,u);
                  r.onreadystatechange = function () {
                      if (r.readyState != 4 || r.status != 200) return; 
                      c&&c(JSON.parse(r.responseText));
                  };
                  r.send(d);
      }
      $_.prototype.promise = function() {
                  _pro = this;
                  _pro.promises = {};
                  _pro.status   = false;
                  _pro.add    = function (name,fn) {
                      _pro.promises[name] = false;
                      _pro.promises[name] = fn();
                  };
                  _pro.fulfill = function (name) {
                         _pro.promises[name] = true;
                         if((_pro.success[name]) && (typeof(_pro.success[name]) == 'function')) _pro.success[name]();
                         check();
                  };
                  _pro.success = function (name,fn){
                      _pro.success[name] = fn;
                  }
                  _pro.achieved = function (fn) {
                      _pro.successFn = fn;
                  }
                  check = function () {
                        for(var i in _pro.promises){
                           if(!_pro.promises[i]) return; 
                        } _pro.status =  true;
                        if((_pro.successFn)&&(typeof(_pro.successFn) == 'function')) _pro.successFn();
                        else return console.warn('Aid Warning: No function is executed when promise is achieved');
                  }
      }
      $_.prototype.createModule = function (n,f) {
            if (typeof(f) == 'function') aidModule[n] = new f(); 
            else aidModule[n] = f;
      }
      /*End AID Functions*/
      ww.$_ =  new $_();
})(document,window);