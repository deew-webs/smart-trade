

function s_DoIT()
{
    pointToggleChange(document.getElementsByClassName('tp-point-c')[3]);
    pointToggleChange(document.getElementsByClassName('sp-point-c')[2]);
}


function pointToggleChange(d)
{
    dinfo = d.getAttribute('name').split('-');
    let arr = document.getElementsByClassName(dinfo[0] + '-point-c');
    let state = true;
    let x=0;
    Array.from(arr).forEach(ele =>
    {
        if(d.getAttribute('name') == ele.getAttribute('name'))
        {
            state = false;
            pointDisableItems(ele, dinfo, d.checked);
        }
        else if(d.checked == state)
                pointDisableItems(ele, dinfo, d.checked);
        x++;
    });
}

function pointDisableItems(ele, dinfo, flag)
{
    ele.checked = flag;
    let opa = flag ? 'opacity:0.7;' : 'opacity:0.3;', opa2 = flag ? 'opacity:1;' : 'opacity:0.3;';
    ele.parentNode.parentNode.getElementsByClassName('slider')[0].setAttribute('style', opa);
    ele.parentNode.parentNode.getElementsByClassName('slider')[1].setAttribute('style', opa);
    ele.parentNode.parentNode.getElementsByTagName('span')[0].setAttribute('style', opa2);
    ele.parentNode.parentNode.getElementsByTagName('span')[1].setAttribute('style', opa2);
}

function sliderChange(d)
{
    document.getElementById(d.name).innerText = d.value + "%";
}