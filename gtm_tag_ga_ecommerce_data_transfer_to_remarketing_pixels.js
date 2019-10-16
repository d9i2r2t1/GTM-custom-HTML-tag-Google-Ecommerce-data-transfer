<script>
//GA Ecommerce data transfer to remarketing pixels
//v1.01
//
//Данный код необходимо установить в Google Tag Manager с помощью Custom HTML тега и с триггером All Pages
//
//Документация на русском: https://clck.ru/JXgHF
//Разработчик: facebook.com/oleg.dirtrider

(function(){
    //необходимо заполнить объект настроек своими данными
    var settings = {
        //выбор пикселей для отправки событий: true - активен, false - неактивен
        pixels: {
            vk: true,
            facebook: true,
            myTarget: true
        },

        //настройки пикселя ВКонтакте
        vk: {
            //id пикселей (даже если пиксель ВК один - все равно необходимо указать его id в массиве)
            pixelIDs: ['ID_ПИКСЕЛЯ_ВКОНТАКТЕ'],

            //словарь 'хост : id прайс-листа'
            priceListIds: {
                'moscow.testsite.ru': 1111, //Москва
                'spb.testsite.ru': 2222 //Санкт-Петербург
            },

            //валюта товаров для пикселя по умолчанию
            defaultCurrency: 'RUB'
        },

        //настройки пикселя facebook
        facebook: {
            //id пикселей (даже если пиксель facebook один - все равно необходимо указать его id в массиве)
            pixelIDs: ['ID_ПИКСЕЛЯ_FACEBOOK'],

            //валюта товаров для пикселя по умолчанию
            defaultCurrency: 'RUB'
        },

        myTarget: {
            //id счетчика myTarget (даже если счетчик myTarget один - все равно необходимо указать его id в массиве)
            pixelIDs: ['ID_СЧЕТЧИКА_MYTARGET'],

            //словарь 'хост : фид'
            priceListIds: {
                'moscow.testsite.ru': '111', //Москва
                'spb.testsite.ru': '222', //Санкт-Петербург
            }
        },

        //регулярное выражение, идентифицирующее страницу с результатами поисковой выдачи по сайту
        //если не заполнить - не будет работать отправка событий поиска по сайту
        siteSearchPage: /search\.html/,

        //регулярное выражение, идентифицирующее главную страницу сайта
        //если не заполнить - не будет работать отправка события посещения главной страницы сайта
        mainPage: /testsite\.ru\/($|\?)/,

        //регулярное выражение, идентифицирующее страницы каталога сайта
        //если не заполнить - не будет работать отправка событий посещений страниц каталога на сайте
        catalogPage: /testsite\.ru\/catalog\//,
        
        //параметр url поискового запроса на сайте
        //если не заполнить - не будет передаваться поисковый запрос при отправке событий поиска по сайту
        siteSearchQueryParam: 'query',

        //если тип страницы пушится в dataLayer, то можно указать gtm-переменную с его значением
        //используется как второстепенный источник определения типа страницы (в первую очередь проверяется регулярное выражение)
        pageTypeGTM: {{varDL_pageType}},

        //соответствие названий типов страниц из gtm-переменной главной странице сайта и страницам каталога сайта
        //т.к. названий типов страниц каталога может быть несколько - необходимо указывать их в массиве (даже если тип один)
        pageTypeGTMnames: {
            main: 'Главная',
            catalog: ['Каталог_1', 'Каталог_2']
        },

        //режим дебага (в консоль будет выводиться системная информация): true - включен, false - выключен
        debug: true
    };


//*************************************************************************************************************************
//* при внесении изменений в ниженаписанный код до закрывающего тега "/script" корректная работа скрипта не гарантируется *
//*************************************************************************************************************************
    var main = {
        vk: {
            //название объекта для вывода в консоль при активированном режиме дебага
            debugName: 'vk',

            //оформление вывода в консоль при активированном режиме дебага
            debugCSS: 'background-color: PowderBlue;',

            //соответствие событий ecommerce GA и событий пикселя ВК
            eventsEcomm: {
                impressions: ['view_home', 'view_category', 'view_search', 'view_other'],
                detail: 'view_product',
                add: 'add_to_cart',
                remove: 'remove_from_cart',
                checkout: 'init_checkout',
                purchase: 'purchase'
            },

            //метод определения названия события для пикселя
            getEventName: function(ecommEventName){
                debug.log_start.call(this, 'vk.getEventName');
                if (ecommEventName !== 'impressions') return this.eventsEcomm[ecommEventName];
                else if (settings.siteSearchPage.test(main.url.href)) return this.eventsEcomm.impressions[2];
                else if (main.event.getCustomPageType() === 'main' || main.event.getGTMpageType() === 'main') return this.eventsEcomm.impressions[0];
                else if (main.event.getCustomPageType() === 'catalog' || main.event.getGTMpageType() === 'catalog') return this.eventsEcomm.impressions[1];
                else return this.eventsEcomm.impressions[3];
            },

            //метод определения параметров события для пикселя
            getEventParams: function(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue, ecommEventName){
                debug.log_start.call(this, 'vk.getEventParams');
                var eventParams = new this.eventParamConstructor(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue);
                if (ecommEventName === 'impressions'){
                    eventParams.total_price = undefined;
                    eventParams.currency_code = undefined;
                }
                for (var param in eventParams){
                    if (!eventParams[param]) delete eventParams[param];
                }
                return eventParams;
            },

            //метод-конструктор объекта параметров события для пикселя
            eventParamConstructor: function(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue){
                debug.log_start.call(main.vk, 'vk.eventParamConstructor');
                this.products = main.vk.getProductParams(ecommEventProducts);
                this.category_ids = main.products.getCategoryString(ecommEventProducts);
                this.currency_code = main.products.getCurrencyCode('vk', ecommEventCurrencyCode);
                this.total_price = main.products.getTotalPrice(ecommEventProducts, ecommEventRevenue);
                this.search_string = main.event.getSiteSearchPhrase();
            },

            //метод получения параметров объекта products для пикселя
            getProductParams: function(ecommEventProducts){
                debug.log_start.call(this, 'vk.getProductParams');
                var arr = [];
                for (var i = 0; i < ecommEventProducts.length; i++){
                    var productParams = new Object({
                        id: String(ecommEventProducts[i].id),
                        group_id: String(ecommEventProducts[i].brand),
                        price: (parseInt(ecommEventProducts[i].price * 100, 10)) / 100
                    });
                    for (var param in productParams){
                        if (!productParams[param]) delete productParams[param];
                    }
                    arr.push(productParams);
                }
                return arr;
            },

            //метод выбора прайс-листа
            getPriceListId: function(hostname){
                debug.log_start.call(this, 'vk.getPriceListId');
                return settings.vk.priceListIds[hostname];
            },

            //метод загрузки openapi.js
            openapiInit: function(){
                debug.log_start.call(this, 'vk.openapiInit');
                if (document.getElementById('vk_api_transport')){
                    debug.log.call(this, 'openapi.js уже пытались загрузить ранее, выхожу...');
                    return;
                }
                var openapi = document.createElement('div');
                var body = document.getElementsByTagName('body')[0];
                var el = document.createElement('script');
                openapi.id = 'vk_api_transport';
                body.insertBefore(openapi, body.firstChild);
                el.type = 'text/javascript';
                el.src = 'https://vk.com/js/api/openapi.js?159';
                el.async = true;
                document.getElementById('vk_api_transport').appendChild(el);
                debug.log.call(this, 'контейнер с openapi.js установлен');
            },

            //метод инициализации пикселя ВК
            pixelInit: function(pixelID){
                debug.log_start.call(this, 'vk.pixelInit');
                VK.Retargeting.Init(pixelID);
                debug.log.call(this, 'инициализирован пиксель', pixelID);
            },

            //метод отправки просмотра страницы
            sendPageView: function(){
                debug.log_start.call(this, 'vk.sendPageView');
                if (!window.VK){
                    debug.log.call(this, 'window.VK не обнаружен, устанавливаю openapi.js...');
                    this.openapiInit();
                    window.vkAsyncInit = function(){
                        debug.log.call(main.vk, 'vkAsyncInit: начинаю отправку события PageView');
                        for (var i = 0; i < settings.vk.pixelIDs.length; i++){
                            main.vk.pixelInit(settings.vk.pixelIDs[i]);
                            VK.Retargeting.Hit();
                            debug.log.call(main.vk, 'событие PageView отправлено в пиксель', settings.vk.pixelIDs[i]);
                        }
                    };
                } else{
                    debug.log.call(this, 'window.VK обнаружен, начинаю инициализацию и отправку события PageView');
                    for (var i = 0; i < settings.vk.pixelIDs.length; i++){
                        main.vk.pixelInit(settings.vk.pixelIDs[i]);
                        VK.Retargeting.Hit();
                        debug.log.call(this, 'событие PageView отправлено в пиксель', settings.vk.pixelIDs[i]);
                    }
                }
            },

            //метод отправки события
            sendEvent: function(ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue){
                debug.log_start.call(this, 'vk.sendEvent');
                if (window.VK){
                    debug.log.call(this, 'window.VK обнаружен, начинаю инициализацию и отправку');
                    var pixelEvent = new main.event.eventConstructor('vk', ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue);
                    var priсeListID = this.getPriceListId(main.url.host);
                    var name = pixelEvent.name;
                    var params = pixelEvent.params;
                    for (var i = 0; i < settings.vk.pixelIDs.length; i++){
                        this.pixelInit(settings.vk.pixelIDs[i]);
                        VK.Retargeting.ProductEvent(priсeListID, name, params);
                        debug.log.call(this, 'данные отправлены:', priсeListID, name, params, 'в пиксель', settings.vk.pixelIDs[i]);
                    }
                } else{
                    var counter = 0;
                    var windowVkSearch = function(){
                        if (window.VK) main.vk.sendEvent(ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue);
                        else if (counter < 100){
                            setTimeout(windowVkSearch, 100);
                            counter++;
                        }
                    };
                    if (document.getElementById('vk_api_transport')){
                        debug.log.call(this, 'window.VK не обнаружен, но контейнер vk_api_transport установлен, подождем...');
                        windowVkSearch();
                    } else{
                        debug.log.call(this, 'window.VK и контейнер vk_api_transport не обнаружены, выхожу...');
                        return;
                    }
                }
            }
        },

        facebook: {
            //название объекта для вывода в консоль при активированном режиме дебага
            debugName: 'facebook',

            //оформление вывода в консоль при активированном режиме дебага
            debugCSS: 'background-color: Plum;',

            //соответствие событий ecommerce GA и событий пикселя Facebook
            eventsEcomm: {
                impressions: ['Search', 'ViewCategory'],
                detail: 'ViewContent',
                add: 'AddToCart',
                remove: 'RemoveFromCart',
                checkout: 'InitiateCheckout',
                purchase: 'Purchase'
            },

            //метод проверки события на необходимость отправки данных в пиксель Facebook
            eventCheck: function(ecommEventName){
                debug.log_start.call(this, 'facebook.eventCheck');
                if (ecommEventName === 'impressions' && !settings.siteSearchPage.test(main.url.href) && main.event.getCustomPageType() !== 'catalog' && main.event.getGTMpageType() !== 'catalog') return false;
                else return true;
            },

            //метод определения названия события для пикселя
            getEventName: function(ecommEventName){
                debug.log_start.call(this, 'facebook.getEventName');
                if (ecommEventName !== 'impressions') return this.eventsEcomm[ecommEventName];
                else if (settings.siteSearchPage.test(main.url.href)) return this.eventsEcomm.impressions[0];
                else if (main.event.getCustomPageType() === 'catalog' || main.event.getGTMpageType() === 'catalog') return this.eventsEcomm.impressions[1];
            },

            //метод определения параметров события
            getEventParams: function(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue, ecommEventName){
                debug.log_start.call(this, 'facebook.getEventParams');
                var eventParams = new this.eventParamConstructor(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue);
                if (ecommEventName === 'impressions' && settings.siteSearchPage.test(main.url.href)) return new Object({
                    contents: eventParams.contents,
                    content_category: eventParams.content_category,
                    search_string: eventParams.search_string
                });
                else if (ecommEventName === 'impressions' && !settings.siteSearchPage.test(main.url.href)) return new Object({
                    contents: eventParams.contents,
                    content_name: eventParams.content_name,
                    content_type: eventParams.content_type
                });
                else if (ecommEventName === 'checkout') return new Object({
                    contents: eventParams.contents,
                    content_category: eventParams.content_category,
                    num_items: eventParams.num_items,
                    currency: eventParams.currency,
                    value: eventParams.value
                });
                else if (ecommEventName === 'purchase') return new Object({
                    contents: eventParams.contents,
                    content_name: eventParams.content_name,
                    content_type: eventParams.content_type,
                    currency: eventParams.currency,
                    value: eventParams.value,
                    num_items: eventParams.num_items
                });
                else return new Object({
                    contents: eventParams.contents,
                    content_name: eventParams.content_name,
                    content_type: eventParams.content_type,
                    currency: eventParams.currency,
                    value: eventParams.value
                });
            },

            //метод-конструктор объекта параметров события
            eventParamConstructor: function(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue){
                debug.log_start.call(main.facebook, 'facebook.eventParamConstructor');
                this.contents = main.facebook.getСontents(ecommEventProducts);
                this.content_name = main.products.getContentNameString(ecommEventProducts);
                this.content_type = main.facebook.getContentType();
                this.currency = main.products.getCurrencyCode('facebook', ecommEventCurrencyCode);
                this.value = main.products.getTotalPrice(ecommEventProducts, ecommEventRevenue);
                this.content_category = main.products.getCategoryString(ecommEventProducts);
                this.search_string = main.event.getSiteSearchPhrase();
                this.num_items = main.products.getNumItems(ecommEventProducts);
            },

            //метод формирования параметра contents для события
            getСontents: function(ecommEventProducts){
                debug.log_start.call(this, 'facebook.getСontents');
                var arr = [];
                for (var i = 0; i < ecommEventProducts.length; i++){
                    var productParams = new Object({
                        id: String(ecommEventProducts[i].id),
                        quantity: parseInt(ecommEventProducts[i].quantity, 10),
                        item_price: (parseInt(ecommEventProducts[i].price * 100, 10)) / 100
                    });
                    for (var param in productParams){
                        if (param === 'quantity' && isNaN(productParams[param])) productParams[param] = 1;
                        else if (!productParams[param]) delete productParams[param];
                    }
                    arr.push(productParams);
                }
                return arr;
            },

            //метод формирования параметра content_type для события
            getContentType: function(){
                debug.log_start.call(this, 'facebook.getContentType');
                return 'product';
            },

            //метод установки базового кода пикселя
            facebookInit: function(f, b, e, v, n, t, s){
                debug.log_start.call(this, 'facebook.facebookInit');
                if (f.fbq) return;
                n = f.fbq = function(){
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
                debug.log.call(this, 'базовый код пикселя faceebook установлен');
            },

            //метод инициализации пикселя Facebook
            pixelInit: function(pixelID){
                debug.log_start.call(this, 'facebook.pixelInit');
                fbq('init', pixelID);
                debug.log.call(this, 'инициализирован пиксель', pixelID);
            },

            //метод отправки просмотра страницы
            sendPageView: function(){
                debug.log_start.call(this, 'facebook.sendPageView');
                if (!window.fbq){
                    debug.log.call(this, 'window.fbq не обнаружен, устанавливаю базовый код пикселя');
                    this.facebookInit(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                    debug.log.call(this, 'начинаю инициализацию и отправку PageView');
                    for (var i = 0; i < settings.facebook.pixelIDs.length; i++){
                        this.pixelInit(settings.facebook.pixelIDs[i]);
                    }
                    fbq('track', 'PageView');
                    debug.log.call(this, 'событие PageView отправлено в пиксели', settings.facebook.pixelIDs);
                } else{
                    debug.log.call(this, 'window.fbq обнаружен, начинаю отправку PageView');
                    fbq('track', 'PageView');
                    debug.log.call(this, 'событие PageView отправлено');
                }
            },

            //метод отправки события
            sendEvent: function(ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue){
                debug.log_start.call(this, 'facebook.sendEvent');
                if (window.fbq){
                    debug.log.call(this, 'window.fbq обнаружен, начинаю инициализацию и отправку');
                    var pixelEvent = new main.event.eventConstructor('facebook', ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue);
                    var name = pixelEvent.name;
                    var params = pixelEvent.params;
                    name === 'RemoveFromCart' || name === 'ViewCategory' ? fbq('trackCustom', name, params) : fbq('track', name, params);
                    debug.log.call(this, 'данные отправлены:', name, params);
                } else{
                    debug.log.call(this, 'window.fbq не обнаружен, выхожу...');
                    return;
                }
            }
        },

        myTarget: {
            //название объекта для вывода в консоль при активированном режиме дебага
            debugName: 'myTarget',

            //оформление вывода в консоль при активированном режиме дебага
            debugCSS: 'background-color: PeachPuff;',

            //соответствие событий ecommerce GA и событий трекера myTarget
            eventsEcomm: {
                impressions: ['home', 'category', 'searchresults', 'other'],
                detail: 'product',
                add: 'cart',
                purchase: 'purchase'
            },

            //метод определения названия события для трекера
            getEventName: function(ecommEventName){
                debug.log_start.call(this, 'myTarget.getEventName');
                if (ecommEventName !== 'impressions') return this.eventsEcomm[ecommEventName];
                else if (settings.siteSearchPage.test(main.url.href)) return this.eventsEcomm.impressions[2];
                else if (main.event.getCustomPageType() === 'main' || main.event.getGTMpageType() === 'main') return this.eventsEcomm.impressions[0];
                else if (main.event.getCustomPageType() === 'catalog' || main.event.getGTMpageType() === 'catalog') return this.eventsEcomm.impressions[1];
                else return this.eventsEcomm.impressions[3];
            },

            //метод определения параметров события для трекера
            getEventParams: function(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue, ecommEventName){
                debug.log_start.call(this, 'myTarget.getEventParams');
                var eventParams = new this.eventParamConstructor(ecommEventProducts, ecommEventRevenue, ecommEventName);
                if (ecommEventName === 'impressions') eventParams.totalvalue = undefined;
                for (var param in eventParams){
                    if (!eventParams[param]) delete eventParams[param];
                }
                return eventParams;
            },

            //метод-конструктор объекта параметров события
            eventParamConstructor: function(ecommEventProducts, ecommEventRevenue, ecommEventName){
                debug.log_start.call(main.myTarget, 'myTarget.eventParamConstructor');
                this.type = 'itemView';
                this.productid = main.products.getProductsId(ecommEventProducts);
                this.pagetype = main.myTarget.getEventName(ecommEventName);
                this.list = main.myTarget.getPriceListId(main.url.host);
                this.totalvalue = main.products.getTotalPrice(ecommEventProducts, ecommEventRevenue);
            },

            //метод выбора фида
            getPriceListId: function(hostname){
                debug.log_start.call(this, 'myTarget.getPriceListId');
                return settings.myTarget.priceListIds[hostname];
            },

            //метод установки кода счетчика myTarget на страницу
            myTargetInit: function(d, w, id){
                debug.log_start.call(this, 'myTarget.myTargetInit');
                if (d.getElementById(id)) return;
                var ts = d.createElement('script');
                ts.type = 'text/javascript';
                ts.async = true;
                ts.id = id;
                ts.src = (d.location.protocol == 'https:' ? 'https:' : 'http:') + '//top-fwz1.mail.ru/js/code.js';
                var f = function(){
                    var s = d.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ts, s);
                };
                if (w.opera == '[object Opera]'){
                    d.addEventListener('DOMContentLoaded', f, false);
                } else{
                    f();
                }
                debug.log.call(this, 'код счетчика myTarget установлен');
            },

            //метод отправки просмотра страницы
            sendPageView: function(){
                debug.log_start.call(this, 'myTarget.sendPageView');
                if (!window._tmr){
                    var _tmr = (window._tmr = []);
                    for (var i = 0; i < settings.myTarget.pixelIDs.length; i++){
                        _tmr.push({
                            id: settings.myTarget.pixelIDs[i],
                            type: 'pageView',
                            start: (new Date()).getTime()
                        });
                        debug.log.call(this, 'событие PageView отправлено в счетчик', settings.myTarget.pixelIDs[i]);
                    }
                    this.myTargetInit(document, window, 'topmailru-code');
                } else debug.log.call(this, 'счетчик myTarget был инициализирован ранее');
            },

            //метод отправки события
            sendEvent: function(ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue){
                debug.log_start.call(this, 'myTarget.sendEvent');
                var pixelEvent = new main.event.eventConstructor('myTarget', ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue);
                var _tmr = window._tmr || (window._tmr = []);
                for (var i = 0; i < settings.myTarget.pixelIDs.length; i++){
                    _tmr.push({
                        id: settings.myTarget.pixelIDs[i],
                        type: pixelEvent.params.type,
                        productid: pixelEvent.params.productid,
                        pagetype: pixelEvent.params.pagetype,
                        list: pixelEvent.params.list,
                        totalvalue: pixelEvent.params.totalvalue
                    });
                    debug.log.call(this, 'данные отправлены:', pixelEvent.params, 'в счетчик', settings.myTarget.pixelIDs[i]);
                }
            }
        },

        products: {
            //название объекта для вывода в консоль при активированном режиме дебага
            debugName: 'products',

            //метод получения массива id товаров
            getProductsId: function(ecommEventProducts){
                debug.log_start.call(this, 'products.getProductsId');
                var idArr = [];
                for (var i = 0; i < ecommEventProducts.length; i++){
                    idArr.push(ecommEventProducts[i].id);
                }
                return idArr;
            },

            //метод получения строки 'a,b,c' категорий товаров, с проверкой на уникальность категорий
            getCategoryString: function(ecommEventProducts){
                debug.log_start.call(this, 'products.getCategoryString');
                var categoryId = '';
                var check = [];
                for (var i = 0; i < ecommEventProducts.length; i++){
                    if (check.indexOf(ecommEventProducts[i].category) === -1){
                        check.push(ecommEventProducts[i].category);
                        categoryId += ',' + ecommEventProducts[i].category;
                    }
                }
                categoryId = categoryId.slice(1);
                return categoryId;
            },

            //метод получения строки 'a,b,c' наименований товаров, с проверкой на уникальность наименования
            getContentNameString: function(ecommEventProducts){
                debug.log_start.call(this, 'products.getContentNameString');
                var contentName = '';
                var check = [];
                for (var i = 0; i < ecommEventProducts.length; i++){
                    if (check.indexOf(ecommEventProducts[i].name) === -1){
                        check.push(ecommEventProducts[i].name);
                        contentName += ',' + ecommEventProducts[i].name;
                    }
                }
                contentName = contentName.slice(1);
                return contentName;
            },

            //метод подсчета общего количества наименований товаров
            getNumItems: function(ecommEventProducts){
                debug.log_start.call(this, 'products.getNumItems');
                var count = 0;
                for (var i = 0; i < ecommEventProducts.length; i++){
                    if (ecommEventProducts[i].hasOwnProperty('quantity')) count += parseInt(ecommEventProducts[i].quantity, 10);
                    else count += 1;
                }
                return count;
            },

            //метод определения валюты товаров
            getCurrencyCode: function(pixel, ecommEventCurrencyCode){
                debug.log_start.call(this, 'products.getCurrencyCode');
                if (!ecommEventCurrencyCode) return settings[pixel].defaultCurrency;
                else return ecommEventCurrencyCode;
            },

            //метод определения общей стоимости товаров
            getTotalPrice: function(ecommEventProducts, ecommEventRevenue){
                debug.log_start.call(this, 'products.getTotalPrice');
                var sumPrice = 0;
                if (ecommEventRevenue){
                    sumPrice = (parseInt(ecommEventRevenue * 100, 10)) / 100;
                    return sumPrice;
                } else{
                    for (var i = 0; i < ecommEventProducts.length; i++){
                        if (ecommEventProducts[i].hasOwnProperty('quantity')) sumPrice += ((parseInt(ecommEventProducts[i].price * 100, 10)) / 100) * parseInt(ecommEventProducts[i].quantity, 10);
                        else sumPrice += (parseInt(ecommEventProducts[i].price * 100, 10)) / 100;
                    }
                    return sumPrice;
                }
            }
        },

        event: {
            //название объекта для вывода в консоль при активированном режиме дебага
            debugName: 'event',

            //метод проверки события на необходимость отправки данных в пиксели
            eventCheck: function(ecommEventName, ecommEventObj){
                debug.log_start.call(this, 'event.eventCheck');
                var eventCheckedObj = {};
                for (var pixel in settings.pixels){
                    if (settings.pixels[pixel]){
                        if (!main[pixel].eventsEcomm.hasOwnProperty(ecommEventName)) eventCheckedObj[pixel] = false;
                        else if (ecommEventName === 'checkout' && parseInt(ecommEventObj.actionField.step, 10) !== 1) eventCheckedObj[pixel] = false;
                        else if (main[pixel].hasOwnProperty('eventCheck') && !main[pixel].eventCheck(ecommEventName, ecommEventObj)) eventCheckedObj[pixel] = false;
                        else eventCheckedObj[pixel] = true;
                    } else eventCheckedObj[pixel] = false;
                }
                return eventCheckedObj;
            },

            //метод-конструктор объекта события
            eventConstructor: function(pixel, ecommEventName, ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue){
                debug.log_start.call(main.event, 'event.eventConstructor');
                this.name = main[pixel].getEventName(ecommEventName);
                this.params = main[pixel].getEventParams(ecommEventProducts, ecommEventCurrencyCode, ecommEventRevenue, ecommEventName);
            },

            //метод определения типа страницы
            getCustomPageType: function(){
                debug.log_start.call(this, 'event.getCustomPageType');
                if (settings.mainPage.test(main.url.href)){
                    debug.log.call(this, 'тип страницы, определенный встроенным методом: main');
                    return 'main';
                }
                else if (settings.catalogPage.test(main.url.href)){
                    debug.log.call(this, 'тип страницы, определенный встроенным методом: catalog');
                    return 'catalog';
                }
                else{
                    debug.log.call(this, 'тип страницы, определенный встроенным методом: other');
                    return 'other';
                }
            },

            //метод определения типа страницы из переменной gtm
            getGTMpageType: function(){
                debug.log_start.call(this, 'event.getGTMpageType');
                if (settings.pageTypeGTM === settings.pageTypeGTMnames.main){
                    debug.log.call(this, 'тип страницы, определенный из gtm-переменной: main');
                    return 'main';
                }
                else if (settings.pageTypeGTMnames.catalog.indexOf(settings.pageTypeGTM) !== -1){
                    debug.log.call(this, 'тип страницы, определенный из gtm-переменной: catalog');
                    return 'catalog';
                }
                else{
                    debug.log.call(this, 'тип страницы, определенный из gtm-переменной: other');
                    return 'other';
                }
            },

            //метод определения поискового запроса пользователя
            getSiteSearchPhrase: function(){
                debug.log_start.call(this, 'event.getSiteSearchPhrase');
                var query = main.url.search.substring(1);
                var vars = query.split('&');
                var queryString = {};
                for (var i = 0; i < vars.length; i++){
                    var pair = vars[i].split('=');
                    if (typeof queryString[pair[0]] === 'undefined') queryString[pair[0]] = decodeURIComponent(pair[1]);
                    else if (typeof queryString[pair[0]] === 'string'){
                        var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
                        queryString[pair[0]] = arr;
                    } else queryString[pair[0]].push(decodeURIComponent(pair[1]));
                }
                for (var param in queryString){
                    if (Array.isArray(queryString[param])) queryString[param] = queryString[param].join();
                }
                if (settings.siteSearchPage.test(main.url.href)){
                    debug.log.call(this, 'поисковый запрос:', queryString[settings.siteSearchQueryParam]);
                    return queryString[settings.siteSearchQueryParam];
                } else debug.log.call(this, 'страница не содержит поисковую выдачу по сайту');
            }
        },

        //параметры url страницы
        url: {
            //хост
            host: window.location.hostname,

            //запрос
            search: window.location.search,

            //полный url
            href: window.location.href
        },

        //название группы ниженаписанных методов для вывода в консоль при активированном режиме дебага
        debugName: 'system',

        //метод первого запуска пикселей на странице
        firstStart: function(){
            debug.log_start.call(this, 'firstStart');
            for (var pixel in settings.pixels){
                if (settings.pixels[pixel]) main[pixel].sendPageView();
            }
            if (window.dataLayer){
                for (var i = 0;  i < dataLayer.length; i++){
                    if (!dataLayer[i].hasOwnProperty('ecommerce')){
                        debug.log.call(this, 'ecommerce в событии', i, 'не обнаружен');
                        continue;
                    }
                    debug.log.call(this, 'ecommerce в событии', i, 'обнаружен');
                    var ecommEventCurrencyCode = dataLayer[i].ecommerce.currencyCode;
                    for (var property in dataLayer[i].ecommerce){
                        debug.log.call(this, 'начинаю обработку события ecommerce', property);
                        var products = undefined;
                        var revenue = undefined;
                        property !== 'impressions' ? products = dataLayer[i].ecommerce[property].products : products = dataLayer[i].ecommerce[property];
                        if (property === 'purchase' && dataLayer[i].ecommerce[property].actionField.hasOwnProperty('revenue')) revenue = dataLayer[i].ecommerce[property].actionField.revenue;
                        debug.log.call(this, 'запускаю проверку события', property);
                        var eventCheckedObj = main.event.eventCheck(property, dataLayer[i].ecommerce[property]);
                        for (var checkedPixel in eventCheckedObj){
                            if (eventCheckedObj[checkedPixel]){
                                debug.log.call(this, 'проверка события', property, 'для', checkedPixel, 'пройдена, начинаю отправку данных');
                                main[checkedPixel].sendEvent(property, products, ecommEventCurrencyCode, revenue);
                            } else debug.log.call(this, 'проверка события', property, 'для', checkedPixel, 'не пройдена');
                        }
                    }
                }
            } 
        },

        //метод установки слушателя на dataLayer.push
        setDataLayerPushListener: function(originalPush){
            debug.log.call(this, 'устанавливаю слушатель на dataLayer.push');
            dataLayer.push = function(){
                debug.log.call(main, 'перехвачен dataLayer.push');
                originalPush.apply(this, arguments);
                debug.log.call(main, 'оригинальный dataLayer.push отправлен');
                if (!arguments[0].hasOwnProperty('ecommerce')){
                    debug.log.call(main, 'в перехваченном dataLayer.push ecommerce не обнаружен');
                    return;
                } else main.otherStart(arguments[0]);
            };
        },

        //метод запуска пикселей при перехвате dataLayer.push
        otherStart: function(dataLayerPushArg){
            debug.log_start.call(this, 'otherStart');
            var ecommEventCurrencyCode = dataLayerPushArg.ecommerce.currencyCode;
            for (var property in dataLayerPushArg.ecommerce){
                debug.log.call(this, 'начинаю обработку события ecommerce', property, 'из dataLayer.push');
                var products = undefined;
                var revenue = undefined;
                property !== 'impressions' ? products = dataLayerPushArg.ecommerce[property].products : products = dataLayerPushArg.ecommerce[property];
                if (property === 'purchase' && dataLayerPushArg.ecommerce[property].actionField.hasOwnProperty('revenue')) revenue = dataLayerPushArg.ecommerce[property].actionField.revenue;
                debug.log.call(this, 'запускаю проверку события', property);
                var eventCheckedObj = main.event.eventCheck(property, dataLayerPushArg.ecommerce[property]);
                for (var checkedPixel in eventCheckedObj){
                    if (eventCheckedObj[checkedPixel]){
                        debug.log.call(this, 'проверка события', property, 'для', checkedPixel, 'пройдена, начинаю отправку данных');
                        main[checkedPixel].sendEvent(property, products, ecommEventCurrencyCode, revenue);
                    } else debug.log.call(this, 'проверка события', property, 'для', checkedPixel, 'не пройдена');
                }
            }
        }
    };

    var debug = {
        //метод вывода данных в консоль при активированном режиме дебага
        log: function(){
            var argArr = [];
            for(var i = 0; i < arguments.length; i++){
                if (typeof arguments[i] === 'object') arguments[i] = JSON.stringify(arguments[i]);
                argArr.push(arguments[i]);
            }
            if (settings.debug && /данные отправлены|PageView отправлено/.test(argArr.join(' '))) console.log('[GTM_UDRT]%c[' + this.debugName + ' *SEND*]', this.debugCSS + 'font-weight: bold;', argArr.join(' '));
            else if (settings.debug && /проверка события.*не пройдена/.test(argArr.join(' '))) console.log('[GTM_UDRT]%c[' + this.debugName + ']', 'background-color: LightCoral;', argArr.join(' '));
            else if (settings.debug && /ecommerce в событии \d* обнаружен|проверка события.*пройдена|начинаю обработку события ecommerce/.test(argArr.join(' '))) console.log('[GTM_UDRT]%c[' + this.debugName + ']', 'background-color: PaleGreen;', argArr.join(' '));
            else if (settings.debug) console.log('[GTM_UDRT]%c[' + this.debugName + ']', this.debugCSS, argArr.join(' '));
        },
    
        //метод вывода данных в консоль о старте выполнения метода при активированном режиме дебага
        log_start: function(methodPath){
            if (settings.debug) console.log('[GTM_UDRT]%c[' + this.debugName + ']', this.debugCSS, 'старт метода main.' + methodPath + '()');
        },
    };

    //старт работы тега
    try{
        main.firstStart();
        if (window.dataLayer) main.setDataLayerPushListener(dataLayer.push);
        else debug.log.call(main, 'dataLayer не обнаружен, выхожу...');
    } catch(e){
        console.log('[GTM_UDRT] ERROR');
    }
})();
</script>


<!--Отработка пикселей ремаркетинга при отключенном js у пользователя-->
<noscript>
    <img src="https://vk.com/rtrg?p=ID_ПИКСЕЛЯ_ВКОНТАКТЕ" style="position:fixed; left:-999px;" alt=""/>
    <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=ID_ПИКСЕЛЯ_FACEBOOK&ev=PageView&noscript=1"/>
    <img src="//top-fwz1.mail.ru/counter?id=ID_СЧЕТЧИКА_MYTARGET;js=na" style="border:0;position:absolute;left:-9999px;" alt="" />
</noscript>