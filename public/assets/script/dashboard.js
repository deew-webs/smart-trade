
function leverageChange(ele)
{
    let val = ele.value.toString();
    if(val.length == 1)
        val = '0' + val;
    document.getElementById(ele.name).innerText = "x" + val;
}

function quantityChange(ele)
{
    let val = ele.value.toString();
    if(val.length == 1)
        val = '0' + val;
    document.getElementById(ele.name).innerText = val + '%';
}

function marketToggleChange(ele)
{
    document.getElementById('d-entery').disabled = ele.checked;
}