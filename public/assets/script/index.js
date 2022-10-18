//const deew = new DEEW();
var api = window.location.href.replace(window.location.hash, "") + 'API/';
var session = deew.GetCookieByName('__s');
toastr.options = __c_toastOntions;
var accounts, strategys, mainacc;


//-- remove ad
var inter = setInterval(() =>
{
    if(document.getElementsByClassName('w-webflow-badge')[0])
        document.getElementsByClassName('w-webflow-badge')[0].remove();
}, 1);

setTimeout(() =>
{
    clearInterval(inter);
}, 10000);


//-- onload stuff  -->  (call other functions...)
document.body.onload = function f()
{
    funcOnLoaded();
    funcListAccount();
    funcListStrategy();
    document.getElementById('a-button-save').addEventListener('click', funcUpdateAccount);
    document.getElementById('s-button-save').addEventListener('click', funcUpdateStrategy);
    document.getElementById('a-button-delete').addEventListener('click', funcDeleteAccount);
    document.getElementById('s-button-delete').addEventListener('click', funcDeleteStrategy);

    document.getElementById('d-button-long').addEventListener('click', funcLong);
    document.getElementById('d-button-short').addEventListener('click', funcShort);

    document.getElementById('d-button-entry').addEventListener('click', funcEntry);
    document.getElementById('a-button-qty').addEventListener('click', funcQty2A);
    document.getElementById('d-button-qty').addEventListener('click', funcQty2D);
}


//-- startup stuff  -->  (for authorise)
function funcOnLoaded()
{
    document.getElementById('d-input-qty').value = "5";
    document.getElementById('d-input-lev').value = "12";
    document.getElementById('d-radio-market').checked = true;

    //-- session
    if(session == null)
    {
        session = md5(Date.now());
        document.cookie = '__s=' + session + '; path=/;';
    }

    let __json = {'q' : 'AUTHORISE_CHECK', 'session' : session};
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code != 200 || res.ok == false)
            window.location.href = './VERIFY';
        else
        {
            console.log(res.message);
            let dropSymbols = document.getElementById('d-drop-symbol-lst');
            dropSymbols.innerHTML = "";
            dropSymbols.setAttribute('style', 'overflow-y:auto; height:600px;');

            let arr = Object.keys(res.message);
            arr.forEach((f, i) =>
            {
                let ff = res.message[f];

                //-- add symbol dropdown
                let mee = __c_dropdownItem.replace('[ID]', 'drop-symbol-'+i);
                mee = mee.replace('[TEXT]', ff.id);
                dropSymbols.insertAdjacentHTML('beforeend', mee);
                document.getElementById('drop-symbol-'+i).onclick = (e) =>
                {
                    //-- handle symbol dropdown
                    document.getElementById('d-drop-symbol-txt').innerText = ff.id;
                }
            });
            toastr["success"]("You're verifyed successfully!", "Authorise State");
        }
    });
    
    //-- charts
    new TradingView.widget(__c_tradingview);
    document.getElementById('a-tab-chart-1').insertAdjacentHTML('beforeend', __c_tradeTools);
    DoIT();
}


//-- edit or new account
function funcUpdateAccount()
{
    let name = document.getElementById('a-input-name').value;
    let broker = document.getElementById('a-drop-broker-txt').innerText;
    let main = document.getElementById('a-check-its-main').checked;
    let mine = document.getElementById('a-check-its-mine').checked;
    let active = document.getElementById('a-check-active').checked;
    let qty = document.getElementById('a-input-qty').value;
    let qty2 = document.getElementById('a-button-qty').innerText;
    let key = document.getElementById('a-input-key').value;
    let secret = document.getElementById('a-input-secret').value;
    //let pass = document.getElementById('a-input-pass').value;
    let pass = "passs";

    let __json = {'q' : 'SET_ACCOUNT', 'session' : session, 'name' : name, 'broker' : broker, 'main' : main, 'mine' : mine, 'active' : active, 'qty' : qty, 'qty2' : qty2, 'key' : key, 'secret' : secret, 'pass' : pass};
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                toastr["success"]("Account updated successfully!", "Account's");
                funcListAccount();
            }
            else
                toastr["error"](res.message, "Account's");
        }
        else
            toastr["error"]("Connection error ...!", "Account's");
    });
}


//-- get account list
function funcListAccount()
{
    let __json = {'q' : 'GET_ACCOUNT_LIST', 'session' : session};
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                document.getElementById('a-div-accounts').innerHTML = "";
                accounts = res.message.list;
                res.message.list.forEach((acc, i) =>
                {
                    let col = 'white';
                    if(acc.mine)
                        col = 'green';

                    if(acc.name == res.message.main)
                    {
                        document.getElementById('d-text-tether-balance').innerText = 'future balance: ' + acc.balance + '$';
                        mainacc = acc.name
                        col = 'orange';
                    }

                    
                    let mee = __c_accountItem.replace('[ID]', 'a-item-'+i);
                    mee = mee.replace('[NAME]', acc.name);
                    mee = mee.replace('[BALANCE]', acc.balance);
                    document.getElementById('a-div-accounts').insertAdjacentHTML('beforeend', mee);

                    let it = document.getElementById('a-item-'+i);
                    it.children[0].children[0].setAttribute('style', 'color:'+col);
                    it.children[1].children[0].setAttribute('style', 'color:'+col);

                    it.onmouseover = (e) =>
                    {
                        e.path[1].setAttribute('class', e.path[1].getAttribute('class').replace('col-box-item', 'col-box-hover'));
                    }
                    it.onmouseout = (e) =>
                    {
                        e.path[1].setAttribute('class', e.path[1].getAttribute('class').replace('col-box-hover', 'col-box-item'));
                    }
                    it.onclick = (e) =>
                    {
                        let c = e.path[1].getAttribute('id').split('-')[2];
                        funcLoadAccount(c);
                    }
                });
            }
            else
            {
                setTimeout(funcListAccount, 1000);
            }
        }
        else
            toastr["error"]("Connection error ...!", "Account's");
    });
}


//-- put account info there for edit
function funcLoadAccount(c)
{
    document.getElementById('a-input-name').value = accounts[c]['name'];
    document.getElementById('a-drop-broker-txt').innerText = accounts[c]['broker'];
    document.getElementById('a-check-its-main').checked = accounts[c]['main'];
    document.getElementById('a-check-its-mine').checked = accounts[c]['mine'];
    document.getElementById('a-check-active').checked = accounts[c]['active'];
    document.getElementById('a-input-qty').value = accounts[c]['qty'];
    document.getElementById('a-button-qty').innerText = accounts[c]['qty2'];
    document.getElementById('a-input-key').value = accounts[c]['key'];
    document.getElementById('a-input-secret').value = accounts[c]['secret'];
    document.getElementById('a-check-its-main').checked = accounts[c]['name'] == mainacc;
}


//-- edit or new strategy
function funcUpdateStrategy()
{
    let name = document.getElementById('s-input-name').value;
    let tp_limit = document.getElementById('s-radio-tp-limit').checked;
    let sp_limit = document.getElementById('s-radio-sp-limit').checked;
    let sp = document.getElementById('s-input-percent').value;

    let rf_check = document.getElementById('s-check-riskfree').checked;
    let rf_dynamic_check = document.getElementById('s-check-riskfree-dynamic').checked;
    let trailing_check = document.getElementById('s-check-trailing').checked;

    let rf = document.getElementById('s-input-riskfree').value;
    let rf_dynamic = document.getElementById('s-input-riskfree-dynamic').value;
    let trailing = document.getElementById('s-input-trailing').value;

    let __json = {'q' : 'SET_STRATEGY', 'session' : session, 'name' : name, 'tp_limit' : tp_limit, 'sp_limit' : sp_limit, 'sp' : sp, 'rf_check' : rf_check, 'rf_dynamic_check' : rf_dynamic_check, 'trailing_check' : trailing_check, 'rf' : rf, 'rf_dynamic' : rf_dynamic, 'trailing' : trailing};
    
    for (let i = 1; i <= 10; i++)
    {
        __json['tp_c_'+i] = document.getElementById('tp-c-'+i).checked;
        __json['tp_q_'+i] = document.getElementById('tp-q-'+i).value;
        __json['tp_p_'+i] = document.getElementById('tp-p-'+i).value;
    }

    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                toastr["success"]("Strategy updated successfully!", "Strategy's");
                funcListStrategy();
            }
            else
                toastr["error"](res.message, "Strategy's");
        }
        else
            toastr["error"]("Connection error ...!", "Strategy's");
    });
}


//-- get strategy list
function funcListStrategy()
{
    let __json = {'q' : 'GET_STRATEGY_LIST', 'session' : session};
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                document.getElementById('s-div-strategys').innerHTML = "";
                dropStrategys = document.getElementById('d-drop-strategys-lst');
                dropStrategys.innerHTML = "";
                
                strategys = res.message;
                res.message.forEach((item, i) =>
                {
                    //-- add strategys items
                    let mee = __c_strategyItem.replace('[ID]', 's-item-'+i);
                    mee = mee.replace('[NAME]', item.name);
                    mee = mee.replace('[SP]', item.sp+"%");
                    document.getElementById('s-div-strategys').insertAdjacentHTML('beforeend', mee);
                    document.getElementById('s-item-'+i).onmouseover = (e) =>
                    {
                        e.path[1].setAttribute('class', e.path[1].getAttribute('class').replace('col-box-item', 'col-box-hover'));
                    }
                    document.getElementById('s-item-'+i).onmouseout = (e) =>
                    {
                        e.path[1].setAttribute('class', e.path[1].getAttribute('class').replace('col-box-hover', 'col-box-item'));
                    }
                    document.getElementById('s-item-'+i).onclick = (e) =>
                    {
                        let c = e.path[1].getAttribute('id').split('-')[2];
                        funcLoadStrategy(c);
                    }

                    //-- add strategys dropdown
                    mee = __c_dropdownItem.replace('[ID]', 'drop-strategys-'+i);
                    mee = mee.replace('[TEXT]', item.name);
                    dropStrategys.insertAdjacentHTML('beforeend', mee);
                    document.getElementById('drop-strategys-'+i).onclick = (e) =>
                    {
                        //-- handle strategys dropdown
                        document.getElementById('d-drop-strategys-txt').innerText = item.name;
                        
                        _the_pos = [];
                        /*for (let k = 1; k <= 10; k++)
                        {
                            if(strategys[i]['tp_c_'+k])
                                _the_pos.push({price: strategys[i]['tp_p_'+k]});
                            else
                                break;
                        }*/
                        _the_pos.push({price: _the_price});
                        //_the_pos.push({price: _the_price - (_the_price*strategys[i]['sp'])});
                    }
                });
            }
            else
                toastr["error"](res.message, "Strategy's");
        }
        else
            toastr["error"]("Connection error ...!", "Strategy's");
    });
}


//-- put strategy info there for edit
function funcLoadStrategy(c)
{
    document.getElementById('s-input-name').value = strategys[c]['name'];
    document.getElementById('s-radio-tp-limit').checked = strategys[c]['tp_limit'];
    document.getElementById('s-radio-sp-limit').checked = strategys[c]['sp_limit'];;
    document.getElementById('s-radio-tp-market').checked = !strategys[c]['tp_limit'];
    document.getElementById('s-radio-sp-market').checked = !strategys[c]['sp_limit'];;
    document.getElementById('s-input-percent').value = strategys[c]['sp'];

    document.getElementById('s-check-riskfree').checked = strategys[c]['rf_check'];
    document.getElementById('s-check-riskfree-dynamic').checked = strategys[c]['rf_dynamic_check'];
    document.getElementById('s-check-trailing').checked = strategys[c]['trailing_check'];

    document.getElementById('s-input-riskfree').value = strategys[c]['rf'];
    document.getElementById('s-input-riskfree-dynamic').value = strategys[c]['rf_dynamic'];
    document.getElementById('s-input-trailing').value = strategys[c]['trailing'];

    for (let i = 1; i <= 10; i++)
    {
        document.getElementById('tp-c-'+i).checked = strategys[c]['tp_c_'+i];
        document.getElementById('tp-q-'+i).value = strategys[c]['tp_q_'+i];
        document.getElementById('tp-p-'+i).value = strategys[c]['tp_p_'+i];
    }
}


//-- delete a account
function funcDeleteAccount()
{
    let name = document.getElementById('a-input-name').value;

    let __json = {'q' : 'DELETE_ACCOUNT', 'session' : session, 'name' : name};
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                toastr["success"]("Account deleted successfully!", "Account's");
                funcListAccount();
            }
            else
                toastr["error"](res.message, "Account's");
        }
        else
            toastr["error"]("Connection error ...!", "Account's");
    });
}


//-- delete a strategy
function funcDeleteStrategy()
{
    let name = document.getElementById('s-input-name').value;

    let __json = {'q' : 'DELETE_STRATEGY', 'session' : session, 'name' : name};
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                toastr["success"]("Strategy deleted successfully!", "Strategy's");
                funcListStrategy();
            }
            else
                toastr["error"](res.message, "Strategy's");
        }
        else
            toastr["error"]("Connection error ...!", "Strategy's");
    });
}



//--------------------------------------------------------------------
//-------------------------------------------------- DASHBOARD -------
function funcLong()
{
    funcOpenPosition('LONG');
}
function funcShort()
{
    funcOpenPosition('SHORT');
}

function funcOpenPosition(side)
{
    let strategy_name = document.getElementById('d-drop-strategys-txt').innerText;
    if(strategy_name == 'the strategy name')
    {
        toastr["warning"]('Select a strategy please!', "Position's");
        return;
    }

    let en_limit = document.getElementById('d-radio-limit').checked;
    let entry = document.getElementById('d-input-entry').value;
    if(!en_limit && !deew.IsNumeric(entry))
    {
        toastr["warning"]('Entry is empity!', "Position's");
        return;
    }

    let qty = parseFloat(document.getElementById('d-input-qty').value);
    let qty2 = document.getElementById('d-button-qty').innerText;
    let lev = parseInt(document.getElementById('d-input-lev').value);
    let symbol = document.getElementById('d-drop-symbol-txt').innerText;
    let access = document.getElementById('d-drop-selected-txt').innerText;
    if(!en_limit)
        entry = _the_price;
    else
        entry = parseFloat(entry);
    
    let strategy = null;
    strategys.forEach(s =>
    {
        if(s['name'] == strategy_name)
            strategy = s;
    });

    if(strategy == null)
    {
        toastr["warning"]("Wtf, can't find strategy!", "Position's");
        return;
    }

    let side_factor = (side == "SHORT") ? -1 : 1;
    let sp = entry + (side_factor * entry * strategy['sp'] / 100);
    let __json = {'q': 'ADD_POSITION', 'session': session, 'symbol': symbol, 'entry': entry, 'side': side, 'qty': qty, 'qty2': qty2, 'lev': lev, 'en_limit': en_limit, 'strategy': strategy_name, 's': strategy, 'access': access, 'sp': sp};
    
    for (let i = 1; i <= 10; i++)
    {
        if(strategy['tp_c_'+i])
        {
            __json['tp_q_'+i] = parseInt(strategy['tp_q_'+i]);
            __json['tp_p_'+i] = entry + (side_factor * entry * strategy['tp_p_'+i] / 100);
        }
        else
            break;
    }
    
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                toastr["success"]("Position added successfully!", "Position's");
                funcListStrategy();
            }
            else
                toastr["error"](res.message, "Position's");
        }
        else
            toastr["error"]("Connection error ...!", "Position's");
    });
}


function funcListPositions()
{
    let __json = {'q': 'GET_POSITION_LIST', 'session': session};
    
    deew.PostURL(api, __json, (code, res) =>
    {
        if(code == 200)
        {
            if(res.ok == true)
            {
                let parent_trades = document.getElementById('d-div-trades');
                parent_trades.innerHTML = "";
                let lst_trades = document.getElementById('d-drop-positions-lst');
                lst_trades.innerHTML = "";
                
                strategys = res.message;
                res.message.forEach((item, i) =>
                {
                    //-- add positions items
                    let mee = __c_positionItem.replace('[ID]', 'd-div-trade-'+i);
                    mee = mee.replace('[SYMBOL]', item.vals.symbol);
                    mee = mee.replace('[SP]', item.sp+"%");
                    document.getElementById('d-div-positions').insertAdjacentHTML('beforeend', mee);

                    let it = document.getElementById('d-div-trade-'+i);
                    it.onmouseover = (e) =>
                    {
                        //e.path[1].setAttribute('class', e.path[1].getAttribute('class').replace('col-box-item', 'col-box-hover'));
                    }
                    it.onmouseout = (e) =>
                    {
                        //e.path[1].setAttribute('class', e.path[1].getAttribute('class').replace('col-box-hover', 'col-box-item'));
                    }

                    //-- add positions dropdown
                    mee = __c_dropdownItem.replace('[ID]', 'drop-positions-'+i);
                    mee = mee.replace('[TEXT]', item.vals.symbol);
                    lst_trades.insertAdjacentHTML('beforeend', mee);
                    document.getElementById('drop-positions-'+i).onclick = (e) =>
                    {
                        //-- handle positions dropdown
                        document.getElementById('d-drop-positions-txt').innerText = item.name;
                        
                        //_the_pos = [];
                        //_the_pos.push({price: _the_price});

                        /*for (let k = 1; k <= 10; k++)
                        {
                            if(strategys[i]['tp_c_'+k])
                                _the_pos.push({price: strategys[i]['tp_p_'+k]});
                            else
                                break;
                        }*/
                        //_the_pos.push({price: _the_price - (_the_price*strategys[i]['sp'])});
                    }
                });
            }
        }
        else
            toastr["error"]("Connection error ...!", "Position's");
    });
}



//--------------------------------------------------------------------
//-------------------------------------------------- UI --------------
function funcEntry()
{
    document.getElementById('d-input-entry').value = _the_price;
}

function funcQty2A()
{
    let qty2 = document.getElementById('a-button-qty');
    qty2.innerText = (qty2.innerText == '%') ? '$' : '%';
}

function funcQty2D()
{
    let qty2 = document.getElementById('d-button-qty');
    qty2.innerText = (qty2.innerText == '%') ? '$' : '%';
}