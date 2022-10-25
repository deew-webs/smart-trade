const deew = new DEEW();

// let metaData = {
//   information:"",
//   symbol:"",
//   lastRefresh:"",
//   outputSize:"",
//   timeZone:""
// }

let candleOhlcMappings = [];
let info =
{
  yMin: [],
  xMin: [],
  yMax: [],
  xMax: [],
  l: 0,
  h: 0,
  minDate: "",
  maxDate: "",
}

var w, h, w_offset, h_offset, x_delay = 50, y_delay = 0;
var canvas;
var ctx;
var centerPoint;
var boundaries;
var _the_symbol = "BTCUSDT", _the_timeframe = "5m";
var _the_pos = [{'price':19950, 'lock':false}, {'price':19680, 'lock':false}, {'price':19550, 'lock':false}];
var _the_price = 0;

//amount of grid lines to evenly distribute for each axis
var xLines = 8;
var yLines = 10;


var hp = 0;
var lp = Infinity;
var dataUri = null;
var dateRange = ["", ""];
var ohlc = [];
var volume = [];

function DoIT()
{
  //-- reset cache
  w = 0;
  h = 0;
  w_offset = 0;
  h_offset = 0;

  candleOhlcMappings = [];
  info = {yMin: [], xMin: [], yMax: [], xMax: [], l: 0, h: 0, minDate: "", maxDate: ""}

  hp = 0;
  lp = Infinity;
  dataUri = null;
  dateRange = ["", ""];
  ohlc = [];
  volume = [];

  canvas = null;
  ctx = null;
  centerPoint = null;
  boundaries = null;

  canvas = document.getElementById("myCanvas");
  w_offset = window.innerWidth - document.getElementById("myChart").offsetWidth;
  h_offset = window.innerHeight - document.getElementById("myChart").offsetHeight;
  ResizeChart();

  //DownAlphavantage();
  //DownBinance();
  setInterval(DownBinance, 200);

  canvas.addEventListener('mouseleave', function (evt) { UpdateChart(); });
  canvas.addEventListener('mousemove', function (evt) { MouseMove(evt); });
  $(".myDrag").draggable({containment: "parent", start: noop, drag: draged, stop: noop});
  window.addEventListener('resize', ResizeChart);
}

function ResizeChart()
{
  //canvas.width = w = document.getElementById("myChart").parentNode.offsetWidth - 100;
  //canvas.height = h = document.getElementById("myChart").parentNode.parentNode.parentNode.parentNode.offsetHeight - 40;
  canvas.width = w = window.innerWidth - w_offset - 100;
  canvas.height = h = window.innerHeight - h_offset;
  ctx = canvas.getContext("2d");
  centerPoint = [w / 2, h / 2];
  boundaries = [w - 50, h - 50];
}

/*$(document).ready(function ()
{
  DoIT();
});*/




function getTimeslots(ohlc)
{
  let count = w / ohlc.length;
  return count;
}

let drawLine = (x, y, style = undefined, dashed = undefined) =>
{
  if(dashed)
    ctx.setLineDash([10, 10]);
  else
    ctx.setLineDash([0, 0]);
  
  ctx.beginPath();
  if (style)
    ctx.strokeStyle = style

  ctx.moveTo(x[0], x[1]);
  ctx.lineTo(y[0], y[1]);
  ctx.stroke();
}

// 0 time
// 1 open
// 2 high
// 3 low
// 4 close
//DRAW CANDLESTICKS
function drawCandles()
{
  let timeSlot = getTimeslots(ohlc);
  let idx = 0;

  for (let candle of ohlc)
  {
    //x = maxPx - ((price - minPrice)/(maxPrice-minPrice)*maxPx)
    let calculatePosition = (price) =>
    {
      let maxPx = info.yMax[1]
      let x = maxPx - ((price - lp) / (hp - lp) * maxPx);
      return x - y_delay;
    }

    let open = candle[1]
    let low = candle[3]
    let close = candle[4]
    let high = candle[2]

    // y axis value for each price point
    let openPosition = Math.floor(calculatePosition(open));
    let lowPosition = Math.floor(calculatePosition(low));
    let highPosition = Math.floor(calculatePosition(high));
    let closePosition = Math.floor(calculatePosition(close));

    //pixel for candle center along x axis
    let currentStep = Math.floor(idx * timeSlot) - x_delay;

    if (openPosition > closePosition) //x,y,w,h
    {
      //deaw cube #089981
      let height = openPosition - closePosition;
      ctx.fillStyle = "#089981";
      ctx.fillRect(currentStep - 1, closePosition, 2, height);
      //deaw line
      drawLine([currentStep, lowPosition], [currentStep, highPosition], "#089981");
      //deaw border
      ctx.strokeStyle = "#089981"
      ctx.beginPath();
      ctx.rect(currentStep - 1, closePosition, 2, height);
      ctx.stroke();
    }
    else
    {
      //deaw cube #f23645
      let height = closePosition - openPosition;
      ctx.fillStyle = "#f23645";
      ctx.fillRect(currentStep - 1, openPosition, 2, height);
      //deaw line
      drawLine([currentStep, lowPosition], [currentStep, highPosition], "#f23645");
      //deaw border
      ctx.strokeStyle = "#f23645"
      ctx.beginPath();
      ctx.rect(currentStep - 1, openPosition, 2, height);
      ctx.stroke();
    }
    candleOhlcMappings.push({ idx: idx, step: currentStep, positions: { openPosition: openPosition, lowPosition: lowPosition, highPosition: highPosition, closePosition: closePosition } });
    idx++;
  }
}

// CALCULATE AMOUNT OF ROWS TO FIT IN GRID
function calculateSteps()
{
  //calculate horizontal lines across the Y axis
  let yDist = h / (xLines+1);
  let yStep = yDist;
  let ySteps = [yStep];
  let yCount = 0;

  while (yCount != xLines)
  {
    yCount++
    yStep += yDist;
    ySteps.push(Math.floor(yStep));
  }

  //calculate vertical lines along the X axis
  let xDist = w / yLines;
  let xStep = xDist;
  let xSteps = [xStep];

  let xCount = 0;

  while (xCount < yLines)
  {
    xCount++;
    xStep += xDist;
    xSteps.push(Math.floor(xStep));
  }
  info.yMin = [0, 0]
  info.yMax = [0, ySteps[ySteps.length - 1]];
  info.xMin = [0, 0];
  info.xMax = [xSteps[xSteps.length - 1], 0];
  return [xSteps, ySteps];
}

//DRAW GRID
function createGrid()
{
  let drawHorizontal = (yPoints) =>
  {
    let myPrices = document.getElementById('myPrices');
    myPrices.innerHTML = "";

    drawLine([0, 0], [w, 0]);
    yPoints.forEach((point, i) => 
    {
      let part = (hp - lp) / 9;
      linePrice = hp - ((i+1) * part);

      if(i != yPoints.length-1)
      {
        let ele = document.createElement("div");
        ele.setAttribute('class', 'myPrice');
        ele.setAttribute('style', 'width: 50px; height: 20px; text-align: center; position: absolute; top: ' + (point-10) + 'px;');
        ele.innerText = Math.floor(linePrice);
        myPrices.append(ele);
      }

      drawLine([0, point], [w, point], "#242733")
    });
  }

  let drawVertical = (xPoints) =>
  {
    drawLine([0, 0], [0, h]);
    for (let point of xPoints)
      drawLine([point, h], [point, 0], "#242733")
  }

  let steps = calculateSteps();

  drawVertical(steps[0])
  drawHorizontal(steps[1])
  return steps;
}

function getPosCompareCanvas(canvas, evt)
{
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}




//------------------------- download (alphavantage) codes




//------------------------- download alphavantage
var itsWorking1 = false;
function DownAlphavantage()
{
  if(!itsWorking1)
  {
    itsWorking1 = true;
    $.ajax({
      url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=aapl&apikey=1EATG6FH0JYICSWH',
      dataType: 'json',
      contentType: "application/json",
      success: function (data)
      {
          // split the data set into ohlc and volume
        let i = 0;
        let dataArray = data['Time Series (Daily)'];
        for (let time in dataArray)
        {
          let stock_info = dataArray[time];

          let newOHLC = [
            time,
            Number(stock_info["1. open"]),
            Number(stock_info["2. high"]),
            Number(stock_info["3. low"]),
            Number(stock_info["4. close"])
          ];

          ohlc.push(newOHLC);
          volume.push([time, Number(stock_info["5. volume"])]);
          
          if (newOHLC[2] > hp) //found highest point
            hp = newOHLC[2];
          if (newOHLC[3] < lp) //found the lowest point
            lp = newOHLC[3];

          i += 1;
        }

        dateRange[0] = ohlc[0][0];
        dateRange[1] = ohlc[i-1][0];

        itsWorking1 = false;
        UpdateChart();
      }
    });
  }
}




//------------------------- download Binance
var itsWorking2 = false;
function DownBinance()
{
  if(!itsWorking2)
  {
    itsWorking2 = true;
    let url = 'https://www.binance.com/fapi/v1/klines?symbol=' + _the_symbol + '&interval=' + _the_timeframe + '&limit=400';
    /*deew.PostURL(api, {'q':'GET_URL', 'url':url}, (code, res) =>
    {
        if(code == 200 && res.ok == true)
        {*/
          //d = JSON.parse(res.message);
          //d = JSON.parse(await deew.PostURL_Async(api, {'q':'GET_URL', 'url':url}));
          //d = res.message;
         // console.log(d);
    $.ajax({
      url: api,
      type: "POST",
      dataType: 'json',
      data: JSON.stringify({'q':'GET_OHLCV', 'symbol':_the_symbol, 'timeframe':_the_timeframe}),
      contentType: "application/json;charset=UTF-8",
      success: function (d)
      {
        itsWorking2 = false;
        hp = 0;
        lp = Infinity;

        if(d.ok && d.message)
        {
          d = JSON.parse(d.message);
          ohlc = [];
          volume = [];

          d.forEach(item =>
          {
            let newOHLC = [Number(item[0]), Number(item[1]), Number(item[2]), Number(item[3]), Number(item[4])];
            ohlc.push(newOHLC);
            volume.push([Number(item[0]), Number(item[5])]);
            
            if (newOHLC[2] > hp) //found highest point
              hp = newOHLC[2];
            if (newOHLC[3] < lp) //found the lowest point
              lp = newOHLC[3];
          });

          dateRange[0] = ohlc[0][0];
          dateRange[1] = ohlc[d.length-1][0];
          _the_price = ohlc[d.length-1][4];
          
          UpdateChart();
        }
      },
      error: function (d)
      {
        itsWorking2 = false;
      }
    });
  }


      //}
    //});
  
}




//------------------------- update Chart codes
function UpdateChart()
{
  if(ohlc.length > 0)
  {
    ctx.fillStyle = "#181a1b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "blue";

    //set max/min date
    createGrid();
    drawCandles();
    dataUri = canvas.toDataURL();

    DrawTpSpLines();
  }

  //DownBinance();
}

function DrawTpSpLines()
{
  let img = new Image();
  img.src = dataUri;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let myDrags = document.getElementById('myDrags');
  myDrags.innerHTML = "";
  
  if(_the_pos.length >= 1)
  {
    _the_pos.forEach((line, i) =>
    {
      let point = (hp - line.price) / (hp - lp) * h;
      
      let color = 'green';
      let ele_id = "d-c-Tp-" + (i+1);
      let ele_class = "myDrag d-c-Tp ui-draggable";
      if(_the_pos.length == 1 || i == _the_pos.length-2)
      {
        color = 'orange';
        ele_id = "d-c-Open";
        ele_class = "myDrag d-c-Open ui-draggable";
      }
      if(_the_pos.length >= 2 && i == _the_pos.length-1)
      {
        color = 'red';
        ele_id = "d-c-Sp";
        ele_class = "myDrag d-c-Sp ui-draggable";
      }

      if(line.price < hp && line.price > lp)
        drawLine([0, point], [w, point], color, true);
        
      let point2 = point-10;
      if(point2 < 0)
        point2 = 0;
      if(point2 > h-20)
        point2 = h-20;
      let ele = document.createElement("div");
      ele.setAttribute('id', ele_id);
      ele.setAttribute('class', ele_class);
      ele.setAttribute('style', 'top: ' + point2 + 'px;');
      ele.innerText = Math.floor(line.price);
      myDrags.append(ele);
    });
  }


  //-- draw current price of symbol
  let point = (hp - _the_price) / (hp - lp) * h;
  drawLine([0, point], [w, point], 'gray', false);

  let point2 = point-10;
  if(point2 < 0)
    point2 = 0;
  if(point2 > h-20)
    point2 = h-20;
  let ele = document.createElement("div");
  ele.setAttribute('id', 'd-c-Now');
  ele.setAttribute('class', 'd-c-Now ui-draggable');
  ele.setAttribute('style', 'top: ' + point2 + 'px;');
  ele.innerText = Math.floor(_the_price);
  myDrags.append(ele);


  $(".myDrag").draggable({containment: "parent", start: noop, drag: draged, stop: noop});
}



//------------------------- mouse move codes
function MouseMove (evt)
{
  if(dataUri != null)
  {
    let mousePos = getPosCompareCanvas(canvas, evt);
    let message = 'مختصات ماوس: ' + mousePos.x + ',' + mousePos.y;
    //document.getElementById('pos').innerText = message;

    let img = new Image();
    img.src = dataUri;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    DrawTpSpLines();
    drawLine([0, mousePos.y], [w, mousePos.y], "white", true);
    drawLine([mousePos.x, 0], [mousePos.x, h], "white", true);
  }
};




//------------------------- drag codes
function noop() { }
function draged(ev)
{
  if(dataUri != null)
  {
    dragPos = getPosCompareCanvas(canvas, ev);  //get drag pos
    let diff = hp - lp;
    let linePrice = hp - (diff * (dragPos.y) / h);
    ev.target.innerText = Math.floor(linePrice);

    ids = ev.target.getAttribute('id').split('-');
    let line;
    if(ids[2] == 'Open')
    {
      if(_the_pos.length == 1)
        line = _the_pos[0];
      else
        line = _the_pos[_the_pos.length-2];
    }
    else if(ids[2] == 'Sp')
      line = _the_pos[_the_pos.length-1];
    else
      line = _the_pos[parseInt(ids[3]-1)];
    
    line.price = linePrice;
    DrawTpSpLines();
    //drawLine([0, dragPos.y], [w, dragPos.y], color, true);
  }
}