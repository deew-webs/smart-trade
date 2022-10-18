
const Events = require('events');

class Exchange extends Events
{
    getExchangeName()
    {
        this.emit('onMessage', "Hello World!, Its A message on EVENT. (Binance)");
        return "Binance";
    }
}

module.exports = Exchange;