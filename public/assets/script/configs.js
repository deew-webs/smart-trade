
__c_toastOntions = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

__c_strategyItem = `<div id="[ID]" class="col-box-item w-row">
                        <div class="col-list-item w-col w-col-6">
                            <div class="text-list-title">[NAME]</div>
                        </div>
                        <div class="col-list-item w-col w-col-3">
                            <div class="text-list-title">[TP]</div>
                        </div>
                        <div class="col-list-item w-col w-col-3">
                            <div class="text-list-title">[SP]</div>
                        </div>
                    </div>`;

__c_accountItem = `<div id="[ID]" class="col-box-item w-row">
                        <div class="col-list-item w-col w-col-6">
                            <div class="text-list-title">[NAME]</div>
                        </div>
                        <div class="col-list-item w-col w-col-6">
                            <div class="text-list-title">[BALANCE]</div>
                        </div>
                    </div>`;

__c_positionItem = `<div id="[ID]" class="div-block-trade">
                        <div class="div-block-6">
                            <div class="trade-box-name">[SYMBOL]</div>
                            <div class="trade-box-percent">[PERCENT]</div>
                        </div>
                        <div class="div-block-r-vals">
                            <div class="trade-box-vals">En : [ENTERY]</div>
                            <div class="trade-box-vals">Pr : [PRICE]</div>
                        </div>
                        <div class="div-block-r-vals">
                            <div class="trade-box-vals">Lq : [LIQUID]</div>
                            <div class="trade-box-vals">Mg : [MARGIN]</div>
                        </div>
                        <div class="div-block-r-vals">
                            <div class="trade-box-v-strategy">strategy : some strategy name</div>
                        </div>
                        <div class="div-block-r-vals">
                            <div class="trade-box-v-accounts">ACCOUNTS : [FILLED] / [TOTAL]</div>
                        </div>
                        <div class="div-block-r-bottom"><a href="#" class="[SIDE-CLASS] w-button">[SIDE]</a><a href="#" class="d-button-edit w-button">EDIT</a><a href="#" class="d-button-close w-button">CLOSE</a></div>
                    </div>`;

__c_tradingview = {
    "autosize": false,
    "width": "100%",
    "height": "100%",
    "symbol": "BINANCE:BTCUSDTPERP",
    "interval": "5",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "hide_side_toolbar": false,
    "allow_symbol_change": true,
    "studies": [
        "BB@tv-basicstudies",
        "MAExp@tv-basicstudies"
    ],
    "container_id": "a-tab-chart-2"
}

__c_tradeTools = `<div id="myChart">
                    <div id="myDrags">
                        
                    </div>
                    <canvas id="myCanvas">

                    </canvas>
                    <div id="myPrices">

                    </div>
                </div>`;


__c_dropdownItem = `<a href="#" id="[ID]" class="dropdown-link w-dropdown-link" tabindex="0">[TEXT]</a>`;