var express = require('express');
var router = express.Router();

router.get('/mini-exchange', function (req, res, next) {
    res.json({
        "ha": "lol"
    });
});

lastId = 0;
sellOrders = {};
buyOrders = {};
gPrice = {};
lastExectuedPrice = {};

router.post('/mini-exchange', function (req, res, next) {
    var messageId = req.body.messageId;
    if (messageId <= lastId) {
        console.log('error messageid');
        res.status(401).send();
    } else {
        lastId = messageId;
        var messageType = req.body.messageType;
        var closePrice = req.body.closePrice;
        var side = req.body.side;
        var orderType = req.body.orderType;
        var symbol = req.body.symbol;
        var orderId = req.body.orderId;
        var quantity = req.body.quantity;
        var price = req.body.price;
        switch (messageType) {
            case 'NEW':
                console.log('new');
                //check symbol in SOD closeprice list
                if (orderId.length <= 0 && orderId > 16) {
                    //TODO: Consider orderId repetition. Add into array to check
                    console.log('wrong orderId');
                    res.status(401).send();
                } else if (quantity < 0) {
                    console.log('quantity less than 0');
                    res.status(401).send();
                } else if (!symbol in gPrice) {
                    console.log('symbol not in sharesss');
                    res.status(401).send();
                } else {
                    switch (side) {
                        case "B":
                            console.log("Buy");
                            switch (orderType) {
                                case "LMT":
                                    console.log("LMT");
                                    if (price === undefined) {
                                        console.log('no price...');
                                        res.status(401).send();
                                    } else if (price <= 0) {
                                        console.log('price negative...');
                                        res.status(401).send();
                                    } else {
                                        orderObj = {
                                            "orderId": orderId,
                                            "quantity": quantity
                                        };
                                        // TODO: Check if there's sell. If there is, sell first
                                        if (!(price in buyOrders[symbol])) {
                                            buyOrders[symbol].push({
                                                price: price,
                                                queue: []
                                            });
                                        }
                                        console.log(buyOrders[symbol]);
                                        buyOrders[symbol].forEach(function (p) {
                                            console.log(p);
                                            if (p.price === price) {
                                                p.queue.push(orderObj);
                                                res.json({
                                                    "status": "ok"
                                                })
                                            }
                                        });
                                    }
                                    break;
                                case "MKT":
                                    console.log('MKT');
                                    //TODO: Check if there's buy. If there is, buy first
                                    //TODO: If buy, then see if full execution or partial execution
                                    //In the case that there is no execution, convert to LMT order

                                    break;
                                default:
                                    console.log('wrong orderType');
                                    res.status(401).send();
                                    break;
                            }
                            break;

                        case "S":
                            console.log("Sell");
                            switch (orderType) {
                                case "LMT":
                                    console.log("LMT");
                                    if (price === undefined) {
                                        console.log('no price...');
                                        res.status(401).send();
                                    } else if (price <= 0) {
                                        console.log('price negative...');
                                        res.status(401).send();
                                    } else {
                                        /**
                                         * Implementation for NEW
                                         */
                                        orderObj = {
                                            "orderId": orderId,
                                            "quantity": quantity
                                        };
                                        // TODO: Check if there's buy. If there is, buy first
                                        if (!(price in sellOrders[symbol])) {
                                            sellOrders[symbol].push({
                                                price: price,
                                                queue: []
                                            });
                                        }
                                        console.log(sellOrders[symbol]);
                                        sellOrders[symbol].forEach(function (p) {
                                            console.log(p);
                                            if (p.price === price) {
                                                p.queue.push(orderObj);
                                                res.json({
                                                    "status": "ok"
                                                })
                                            }
                                        });
                                    }
                                    break;
                                case "MKT":
                                    console.log('MKT');
                                    //TODO: Check if there's buy. If there is, buy first
                                    //TODO: If buy, then see if full execution or partial execution
                                    //In the case that there is no execution, convert to LMT order

                                    break;
                                default:
                                    console.log('wrong orderType');
                                    res.status(401).send();
                                    break;
                            }
                            break;
                        default:
                            console.log('side wrong');
                            res.status(401).send();
                            break;

                    }
                }
                break;

            case 'PRICE':
                console.log('price');
                break;
            case 'QUANTITY':
                console.log('quantity');
                break;
            case 'CANCEL':
                console.log('cancel');
                break;

            case 'SOD':
                console.log('SOD');
                gPrice = JSON.parse(JSON.stringify(closePrice));
                console.log(closePrice);
                keys = Object.keys(closePrice);
                for (var i = 0; i < keys.length; i++) {
                    sellOrders[keys[i]] = [];
                    buyOrders[keys[i]] = [];
                }
                // console.log(sellOrders);
                // price[closePrice] = closePrice[];
                // console.log(price['0005.HK']);
                break;
            case 'EOD':
                console.log('EOD');
                break;
            default:
                console.log('error');
                break;
        }

    }

});


module.exports = router;