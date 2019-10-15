# Универсальный скрипт динамического ремаркетинга для Google Tag Manager

## Описание

Данный скрипт поможет быстро настроить различные пиксели динамического ремаркетинга при настроенной на сайте расширенной электронной торговли Google (Google Enhanced Ecommerce) через dataLayer.

На данный момент, версия скрипта 1.0 поддерживает следующие пиксели динамического ремаркетинга:
* ВКонтакте
* Facebook
* myTarget

Принцип работы скрипта - “дублирование” событий расширенной электронной торговли Google в пиксели динамического ремаркетинга.

Скрипт умеет передавать данные в несколько пикселей одной системы динамического ремаркетинга: например, можно отправлять данные сразу в 2 пикселя Facebook.

Данные о товарах из каждого события расширенной электронной торговли Google обрабатываются в нужный для каждого пикселя вид.

Событие PageView (просмотр страницы) отправляется всегда и для каждого пикселя.

При необходимости, в объектную модель скрипта можно добавить другие пиксели динамического ремаркетинга, которые смогут использовать написанные в данном скрипте методы обработки и отправки данных.

## События и параметры событий

События и структура данных каждого события составлены по официальной документации каждого пикселя.

Скрипт v.1.0 отправляет в пиксели следующие события и их параметры (при их наличии в настроенной электронной торговли Google):

### ВКонтакте
**view_home**

Описание события: Просмотр главной страницы

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘main’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров)
        }
    }

**view_category**

Описание события: Просмотр страницы каталога

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘catalog’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров)
        }
    }

**view_search**

Описание события: Просмотр страницы с результатами поиска по сайту

Соответствует событию Google Enhanced Ecommerce: impressions + страница является страницей с результатами поиска по сайту

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров),
            search_string (поисковый запрос)
        }
    }

**view_other**

Описание события: Просмотр прочих страниц

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘other’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_  

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров)
        }
    }

**view_product**

Описание события: Просмотр детальной страницы товара

Соответствует событию Google Enhanced Ecommerce: detail

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров),
            currency_code (код валюты),
            total_price (общая стоимость)
        }
    }

**add_to_cart**

Описание события: Добавление товара в корзину

Соответствует событию Google Enhanced Ecommerce: add

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров),
            currency_code (код валюты),
            total_price (общая стоимость)
        }
    }

**remove_from_cart**

Описание события: Удаление товара из корзины

Соответствует событию Google Enhanced Ecommerce: remove

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров),
            currency_code (код валюты),
            total_price (общая стоимость)
        }
    }

**init_checkout**

Описание события: Начало оформления заказа (покупки)

Соответствует событию Google Enhanced Ecommerce: checkout + (Ecommerce.checkout.actionField.step = 1)

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров),
            currency_code (код валюты),
            total_price (общая стоимость)
        }
    }

**purchase**

Описание события: Успешная покупка (транзакция)

Соответствует событию Google Enhanced Ecommerce: purchase

Структура данных события:

    {
        priсeListID (id прайс-листа),
        name (название события),
        {
            [
                {
                    id (id товара),
                    group_id (бренд товара),
                    price (стоимость товара)
                },
                …
            ],
            category_ids (категории товаров),
            currency_code (код валюты),
            total_price (общая стоимость)
        }
    }

### Facebook

**ViewCategory**

Описание события: Просмотр страницы каталога

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘catalog’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        ‘trackCustom’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_name (названия товаров),
            content_type (тип товара)
        }
    }

**Search**

Описание события: Просмотр страницы с результатами поиска по сайту

Соответствует событию Google Enhanced Ecommerce: impressions + страница является страницей с результатами поиска по сайту

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        ‘track’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_category (категории товаров),
            search_string (тип товара)
        }
    }

**ViewContent**

Описание события: Просмотр детальной страницы товара

Соответствует событию Google Enhanced Ecommerce: detail

Структура данных события:

    {
        ‘track’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_name (названия товаров),
            content_type (тип товара),
            currency (код валюты),
            value (общая стоимость)
        }
    }

**AddToCart**

Описание события: Добавление товара в корзину

Соответствует событию Google Enhanced Ecommerce: add

Структура данных события:

    {
        ‘track’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_name (названия товаров),
            content_type (тип товара),
            currency (код валюты),
            value (общая стоимость)
        }
    }

**RemoveFromCart**

Описание события: Удаление товара из корзины

Соответствует событию Google Enhanced Ecommerce: remove

Структура данных события:

    {
        ‘trackCustom’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_name (названия товаров),
            content_type (тип товара),
            currency (код валюты),
            value (общая стоимость)
        }
    }

**InitiateCheckout**

Описание события: Начало оформления заказа (покупки)

Соответствует событию Google Enhanced Ecommerce: checkout + (Ecommerce.checkout.actionField.step = 1)

Структура данных события:

    {
        ‘track’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_category (категории товаров),
            num_items (кол-во наименов. товаров),
            currency (код валюты),
            value (общая стоимость)
        }
    }

**Purchase**

Описание события: Успешная покупка (транзакция)

Соответствует событию Google Enhanced Ecommerce: purchase

Структура данных события:

    {
        ‘track’ (метод отправки),
        name (название события),
        {
            [
                {
                    id (id товара),
                    quantity (количество товара),
                    item_price (стоимость товара)
                },
                …
            ],
            content_name (названия товаров),
            content_type (тип товаров),
            currency (код валюты),
            value (общая стоимость),
            num_items (кол-во наименов. товаров)
        }
    }

### myTarget

**home**

Описание события: Просмотр главной страницы

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘main’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида)
    }

**category**

Описание события: Просмотр страницы каталога

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘catalog’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида)
    }

**searchresults**

Описание события: Просмотр страницы с результатами поиска по сайту

Соответствует событию Google Enhanced Ecommerce: impressions + страница является страницей с результатами поиска по сайту

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида)
    }

**other**

Описание события: Просмотр прочих страниц

Соответствует событию Google Enhanced Ecommerce: impressions + тип страницы ‘other’

_Описание_ _типов_ _страниц_ _находится_ _в_ _разделе_ _Описание_ _объекта_ _settings_ 

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида)
    }

**product**

Описание события: Просмотр детальной страницы товара

Соответствует событию Google Enhanced Ecommerce: detail

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида),
        totalvalue (общая стоимость)
    }

**cart**

Описание события: Добавление товара в корзину

Соответствует событию Google Enhanced Ecommerce: add

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида),
        totalvalue (общая стоимость)
    }

**purchase**

Описание события: Успешная покупка (транзакция)

Соответствует событию Google Enhanced Ecommerce: purchase

Структура данных события:

    {
        id (id счетчика),
        type (тип события),
        [id товара, …],
        pagetype (название события),
        list (id фида),
        totalvalue (общая стоимость)
    }

## Алгоритм

[Алгоритм скрипта](https://drive.google.com/open?id=1iVZ5GxOx-Jq-KuLDmQhydN1MpSSV7RMF)

## Настройка скрипта

### Общие сведения

Для работы скрипта на сайте должна быть корректно настроена расширенная электронная торговля Google (Google Enhanced Ecommerce) через dataLayer.

Скрипт берет все данные из расширенной электронной торговли Google, и, следовательно, если в ней есть какие-либо ошибки (например, в отработке событий, в данных о товарах и т.д.) - то все эти ошибки будут и в пикселях динамического ремаркетинга.

Скрипт необходимо внедрить на сайт через Google Tag Manager, используя Custom HTML тег и триггер All Pages (Все страницы).

Для корректной работы скрипта необходимо полностью заполнить объект settings в коде своими вводными данными.

### Описание объекта settings

В таблице описаны все свойства объекта settings.

Свойство объекта settings | Тип данных | Комментарий
--------------------------|------------|----------------------
pixels                    | object     | Доступные в скрипте пиксели динамического ремаркетинга
pixels.vk                 | bool       | Отправка данных в пиксель ВКонтакте: true - активна, false - неактивна
pixels.facebook           | bool       | Отправка данных в пиксель Facebook: true - активна, false - неактивна
pixels.myTarget           | bool       | Отправка данных в трекер myTarget: true - активна, false - неактивна
vk                        | object     | Настройки для пикселя динамического ретаргетинга ВКонтакте
vk.pixelIDs               | array      | ID пикселей, в которые необходимо отправлять данные. Даже если пиксель один - необходимо указать его ID в массиве
vk.priceListIds           | object     | Словарь 'хост : ID прайс-листа'. В зависимости от хоста, на котором сработал скрипт, в ВК будет использоваться тот или иной прайс-лист с ценами товаров. Хост: string. ID прайс-листа: integer
vk.defaultCurrency        | string     | Код валюты, который будет использоваться при отправки данных в пиксель, если в событии Ecommerce не был указан параметр currencyCode
facebook                  | object     | Настройки для пикселя динамического ремаркетинга Facebook
facebook.pixelIDs         | array      | ID пикселей, в которые необходимо отправлять данные. Даже если пиксель один - необходимо указать его ID в массиве
facebook.defaultCurrency  | string     | Код валюты, который будет использоваться при отправки данных в пиксель, если в событии Ecommerce не был указан параметр currencyCode
myTarget                  | object     | Настройки для пикселя динамического ремаркетинга myTarget    
myTarget.priceListIds     | array      | ID трекеров, в которые необходимо отправлять данные. Даже если трекер один - необходимо указать его ID в массиве
myTarget.priceListIds     | object     | Словарь 'хост : фид'. В зависимости от хоста, на котором сработал скрипт, в myTarget будет использоваться тот или иной фид с ценами товаров. Хост: string. Фид: string
siteSearchPage            | string     | Регулярное выражение, идентифицирующее страницу с результатами поисковой выдачи по сайту. Регулярное выражение проверяется на вхождение в полный url страницы. Например, если url страницы с результатами поиска по сайту имеет вид example.ru/search.html?... , то в данном случае siteSearchPage = /search\.html/
mainPage                  | string     | Регулярное выражение, идентифицирующее главную страницу сайта. Регулярное выражение проверяется на вхождение в полный url страницы. Например, если url главной страницы сайта имеет вид testsite.ru/?... , то в данном случае mainPage = /testsite\.ru\/($|\?)/
catalogPage               | string     | Регулярное выражение, идентифицирующее страницы каталога сайта. Регулярное выражение проверяется на вхождение в полный url страницы. Например, если url главной страницы сайта имеет вид testsite.ru/catalog/.../?... , то в данном случае mainPage = /testsite\.ru\/catalog\//
siteSearchQueryParam      | string     | Параметр URL c поисковым запросом на сайте. Например, если URL страницы с результатами поиска по сайту имеет вид example.ru/search/?query=iphone, то siteSearchQueryParam = 'query'
pageTypeGTM               | GTM variable | Переменная GTM со значением типа страницы. Используется как второстепенный источник определения типа страницы (в первую очередь проверяется регулярное выражение). Значение данного свойства указывается в двойных фигурных скобках, например: {{varDL_pageType}}
pageTypeGTMnames          | object     | Соответствие названий типов страниц из GTM-переменной pageTypeGTM главной странице сайта и страницам каталога сайта
pageTypeGTMnames.main     | string     | Тип страницы из GTM-переменной pageTypeGTM, который соответствует главной странице сайта. Например: main: 'Главная'
pageTypeGTMnames.catalog  | array      | Типы страниц из GTM-переменной pageTypeGTM, которые соответствуют страницам каталога сайта. Например: catalog: ['Каталог_Телефоны', 'Каталог_Планшеты']. Даже если GTM-переменная pageTypeGTM принимает только одно значение, соответствующее страницам каталога сайта - все равно необходимо указать его в массиве.
debug                     | bool       | Режим дебага: в консоль будут выводиться системные сообщения: true - активен, false - неактивен. Такой режим нужен для проверки отработки скрипта в режиме Preview GTM, для проверки корректности работы скрипта после добавления нового пикселя в код и просто для лучшего понимания алгоритма работы скрипта. В консоль будут выводиться сообщения о вызове каждого метода, инициализации пикселей, отправленные данные и т.д. Желательно отключать режим дебага при публикации контейнера GTM, содержащего данный скрипт.

### Теги <noscript>

Для отработки скрипта при отсутствии JS у пользователя, необходимо включить в HTML-тег <noscript> код для каждого ID пикселя.

HTML-тег <noscript> находится в самом низу кода данного скрипта.

При отсутствии JS для каждого пикселя отправится только событие PageView (просмотр страницы).

Необходимо включить в HTML-тег <noscript> каждый ID пикселя.

Примеры заполнения (необходимо заменить ID пикселей с нулями на нужные):

**ВКонтакте**

    <img src="https://vk.com/rtrg?p=VK-RTRG-000000-00000" style="position:fixed; left:-999px;" alt=""/>

**Facebook**

    <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=0000000000&ev=PageView&noscript=1"/>

**myTarget**

    <img src="//top-fwz1.mail.ru/counter?id=0000000;js=na" style="border:0;position:absolute;left:-9999px;" alt="" />

## Добавление нового пикселя динамического ремаркетинга в скрипт

### Описание

Объектная модель скрипта поддерживает добавление новых пикселей динамического ремаркетинга.

Добавленные пиксели могут использовать уже написанные методы обработки и отправки данных (см. раздел Методы обработки данных).

Для добавления нового пикселя необходимо в объекте main создать новый объект пикселя, с определенными свойствами и методами (см. раздел Свойства и методы нового пикселя).

Также необходимо в объекте settings создать новый объект с настройками пикселя и добавить название пикселя в свойства объекта settings.pixels.

Важно: название пикселя во всех 3х местах должно быть одинаковым:
* объект в main
* объект в settings
* свойство в settings.pixels

### Объектная модель

Текущая объектная модель скрипта (v.1.0):

[Объектная модель](https://drive.google.com/open?id=12inr3tyO1NMFcGIpfi0XMXssLiqcXuxn)

Обозначения на схеме:
* Группа: объект
* Желтый: свойство
* Зеленый: метод

Необходимые изменения в объектной модели для добавления нового пикселя в скрипт:

[Объектная модель с добавленным новым пикселем](https://drive.google.com/open?id=1PV-c576WokMswWnb8-oK45P8N6uIY-PA)

Обозначения на схеме:
* Группа: объект
* Желтый: свойство
* Зеленый: метод
* Светло-серый: свойство нового пикселя
* Темно-серый: метод нового пикселя
* Серые в зеленой рамке: обязательные свойства и методы нового пикселя

### Свойства и методы нового пикселя

Название пикселя, который мы хотим добавить в скрипт (для примера): new_pixel

#### Настройки (settings)

**settings.pixels** (обязательный)

Данный объект содержит в себе названия пикселей с булевыми значениями.

Необходим для включения-отключения пикселей в скрипте.

Название нового пикселя необходимо добавить в settings.pixels, и присвоить ему значение true, чтобы он был активирован.

Пример:

    //выбор пикселей для отправки событий: true - активен, false - неактивен
           pixels: {
               vk: true,
               facebook: true,
               myTarget: true,
               new_pixel: true
           },

**settings.new_pixel** (обязательный)

В объекте настроек settings необходимо создать объект с названием нового пикселя и с его внутренними настройками, например, id, прайс-листы и т.д.

Пример:

    //настройки пикселя new_pixel
           new_pixel: {
               //id пикселей new_pixel
               pixelID: '1234567',
               //словарь 'хост : прайс-'
               priceListID: '4567'
           },

#### Main

В объекте main создаем новый объект с названием нового пикселя, в который необходимо будет добавить свойства и методы.

Пример:

    new_pixel: {
         },

**main.new_pixel.debugName** (необязательный)

Название нового пикселя, которое будет выводиться в консоль при включенном режиме дебага.

Пример:

    new_pixel: {
               //название объекта для вывода в консоль при активированном режиме дебага
               debugName: 'new_pixel'
           },

**main.new_pixel.debugCSS** (необязательный)

В режиме дебага в консоли события разных пикселей выделяются разными цветами, для более просто визуального восприятия и контроля отработки.

Скриншот консоли с выведенными сообщениями скрипта находится в разделе Debug.
Это свойство содержит CSS-цвет нового пикселя, которым, при включенном режиме дебага, будут выделяться в консоли события, связанные с ним.

Пример:

    new_pixel: {
               //оформление вывода в консоль при активированном режиме дебага
               debugCSS: 'background-color: yellow;'
           },

**main.new_pixel.eventsEcomm** (обязательный)

Словарь из пар ключ-значение, где каждый ключ это событие GA Ecommerce (их названия стандартны и их нельзя менять), а значения это события нового пикселя.

Пример:

    //соответствие событий Ecommerce GA и событий пикселя new_pixel
               eventsEcomm: {
                   impressions: ['Search', 'ViewCategory'],
                   detail: 'ViewContent',
                   add: 'AddToCart',
                   remove: 'RemoveFromCart',
                   checkout: 'InitiateCheckout',
                   purchase: 'Purchase'
               },

**main.new_pixel.getEventName()** (обязательный)

Данный метод вызывается скриптом для каждого активированного в настройках пикселя.

Метод вызывается с параметрами, указанными в тегах @param в JS Doc.

Метод должен возвращать данные, указанные в теге @return в JS Doc.

Метод определения названия события нового пикселя в зависимости от события GA Ecommerce.

JS Doc:

    /**
     * Определяет название события пикселя.
     *
     * @param {string} ecommEventName - Название события GA Ecommerce.
     * @return {string} Название события нового пикселя.
     * 
     */

**main.new_pixel.getEventParams()** (обязательный)

Данный метод вызывается скриптом для каждого активированного в настройках пикселя.

Метод вызывается с параметрами, указанными в тегах @param в JS Doc.

Метод должен возвращать данные, указанные в теге @return в JS Doc.

Метод определения параметров события для нового пикселя.

JS Doc: 

    /**
     * Определяет параметры события пикселя.
     *
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @param {string} ecommEventCurrencyCode - Код валюты из события GA Ecommerce.
     * @param {string|integer|float} ecommEventRevenue - Общая сумма покупки из события GA Ecommerce.
     * @param {string} ecommEventName - Название события GA Ecommerce.
     * @return {object} Объект с параметрами события.
     * 
     */

**main.new_pixel.sendPageView()** (обязательный)

Данный метод вызывается скриптом для каждого активированного в настройках пикселя.

Метод вызывается без параметров.

Метод ничего не должен возвращать - должен только отправлять PageView в пиксель.

Метод отправки просмотра страницы для нового пикселя.

JS Doc: 

    /**
     * Отправляет просмотр страницы (PageView) в пиксель.
     *
     * 
     */

**main.new_pixel.sendEvent()** (обязательный)

Данный метод вызывается скриптом для каждого активированного в настройках пикселя.

Метод вызывается с параметрами, указанными в тегах @param в JS Doc.

Метод ничего не должен возвращать - должен только отправлять событие в пиксель.

Метод отправки события в новый пиксель.

JS Doc: 

    /**
     * Отправляет событие в пиксель.
     *
     * @param {string} ecommEventName - Название события GA Ecommerce.
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @param {string} ecommEventCurrencyCode - Код валюты из события GA Ecommerce.
     * @param {string|integer|float} ecommEventRevenue - Общая сумма покупки из события GA Ecommerce.
     * 
     */

### Методы обработки данных

Все ниже перечисленные методы можно использовать при написании методов нового пикселя в скрипте.

#### Products

Методы обработки массива продуктов из события GA Ecommerce.

**main.products.getProductsId()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод получения массива ID товаров.

JS Doc: 

    /**
     * Метод получения массива id товаров.
     *
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @return {array} Массив с id товаров.
     * 
     */

**main.products.getCategoryString()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод получения строки вида 'a,b,c' категорий товаров, с проверкой на уникальность каждой категории.

JS Doc: 

    /**
     * Метод получения строки 'a,b,c' категорий товаров, с проверкой на уникальность категорий.
     *
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @return {string} Строка с уникальными категориями товаров.
     * 
     */

**main.products.getContentNameString()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод получения строки вида 'a;b;c' наименований товаров, с проверкой на уникальность каждого наименования.

JS Doc: 

    /**
     * Метод получения строки 'a;b;c' наименований товаров, с проверкой на уникальность наименования.
     *
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @return {string} Строка с уникальными наименованиями товаров.
     * 
     */

**main.products.getNumItems()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод подсчета общего количества наименований товаров.

Метод считает именно общее количество товаров, а не уникальных.

JS Doc: 

    /**
     * Метод подсчета общего количества наименований товаров.
     *
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @return {integer} Число, равное общему количеству товаров.
     * 
     */

**main.products.getCurrencyCode()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод определения кода валюты товара.

Если параметр ecommEventCurrencyCode указан - вернет его, если нет - вернет значение кода валюты по умолчанию для указанного пикселя.

JS Doc:

    /**
     * Метод определения валюты товаров.
     *
     * @param {string} pixel - Название пикселя, для которого надо определить валюту.
     * @param {string} ecommEventCurrencyCode - Код валюты из события GA Ecommerce.
     * @return {string} Строка с кодом валюты.
     * 
     */

**main.products.getTotalPrice()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод подсчета общей стоимости товаров.

Если указан параметр ecommEventRevenue - вернет его, если нет - посчитает стоимость товаров из массива.

JS Doc: 

    /**
     * Метод определения общей стоимости товаров.
     *
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @param {integer|float|string} ecommEventRevenue - Общая сумма заказа из события GA Ecommerce.
     * @return {integer} Число, равное общей стоимости товаров/заказа.
     * 
     */

#### Events

Методы обработки параметров события.

**main.event.eventCheck()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод проверки события на необходимость отправки данных в те или иные пиксели.

JS Doc: 

    /**
     * Метод проверки события на необходимость отправки данных в пиксели.
     *
     * @param {string} ecommEventName - Название события GA Ecommerce.
     * @param {object} ecommEventObj - Объект GA Ecommerce.
     * @return {object} Объект из пар ключ-значение, где ключ - название пикселя, значение - bool (прошел проверку или нет).
     * 
     */

**main.event.eventConstructor()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод-конструктор объекта события.

Создает объект вида:

    {
        name: ‘...’,
        params: {...}
    }
    
Конструктор вызывается  в методе sendEvent пикселя, для создания объекта события, который будет непосредственно отправлен в пиксель (название события + параметры).

Конструктор вызывает методы getEventName и getEventParams у пикселя, с которым он был вызван.

JS Doc: 
    
    /**
     * Метод-конструктор объекта события.
     *
     * @constructor
     * @this {eventConstructor}
     * @param {string} pixel - Название пикселя, для которого создаем объект события.
     * @param {string} ecommEventName - Название события GA Ecommerce.
     * @param {array} ecommEventProducts - Массив товаров и их параметров из события GA Ecommerce.
     * @param {string} ecommEventCurrencyCode - Код валюты из события GA Ecommerce.
     * @param {integer|float|string} ecommEventRevenue - Общая сумма заказа из события GA Ecommerce. 
     * 
     */

**main.event.getCustomPageType()**

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод определения типа страницы.

Определяет тип страницы по заполненным настройкам settings.mainPage и settings.catalogPage.

JS Doc: 

    /**
     * Метод определения типа страницы.
     *
     * @return {string} Тип страницы.
     * 
     */

**main.event.getGTMpageType()**

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод определения типа страницы из переменной GTM.

Определяет тип страницы по заполненным настройкам settings.pageTypeGTM и settings.pageTypeGTMnames.

JS Doc: 

    /**
     * Метод определения типа страницы из переменной GTM.
     *
     * @return {string} Тип страницы.
     * 
     */

**main.event.getSiteSearchPhrase()**

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод определения поискового запроса пользователя при использовании поиска по сайту.

Работает при заполненных настройках settings.siteSearchPage и settings.siteSearchQueryParam.

JS Doc: 

    /**
     * Метод определения поискового запроса пользователя.
     *
     * @return {string} Поисковый запрос.
     * 
     */

#### Debug

Методы вывода в консоль при активированном режиме дебага.

При добавлении нового пикселя в скрипт и написании новых методов, для вывода в консоль необходимо использовать не console.log(), а собственные методы вывода в консоль:

**debug.log()**

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод вывода данных в консоль при активированном режиме дебага.

Можно передавать сколько угодно параметров с типами string, integer, float, array, object.

Вызывать метод необходимо через call, передавая в качестве первого аргумента this.

Пример:

    debug.log.call(this, 'событие PageView отправлено в счетчик', settings.myTarget.pixelIDs[i]);

Для вывода сообщений об успешной отправки просмотра страницы необходимо, чтобы один из параметров содержал фразу “PageView отправлено”.

Для вывода сообщений об успешной отправки события необходимо, чтобы один и параметров содержал фразу “данные отправлены”.

В таком случае, сообщение в консоли будет выделено жирным, и к названию пикселя, в который был отправлен PageView или данные, добавится слово *SEND*.

Это поможет быстро найти сообщение об отправке PageView или данных среди множества других сообщений в консоли при активированном режиме дебага.

JS Doc: 

    /**
     * Метод вывода данных в консоль при активированном режиме дебага.
     *
     * @return {string} Строка с выводом в консоль.
     * 
     */

**debug.log_start()**

Метод должен вызываться с параметрами, указанными в тегах @param в JS Doc.

Метод возвращает данные, указанные в теге @return в JS Doc.

Метод вывода данных в консоль о старте выполнения метода при активированном режиме дебага.

В метод необходимо передать строку, содержащую путь до метода объекта (объект main указывать не нужно).

Вызывать метод необходимо через call, передавая в качестве первого аргумента this.

Пример:

    debug.log_start.call(this, 'myTarget.myTargetInit');

JS Doc: 

    /**
     * Метод вывода данных в консоль о старте выполнения метода при активированном режиме дебага.
     *
     * @param {string} methodPath - Путь до метода объекта.
     * @return {string} Строка с выводом в консоль.
     * 
     */
