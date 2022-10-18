const deew = new DEEW();
var api = window.location.href.replace('/VERIFY', '').replace(window.location.hash, "") + '/API/';

document.body.onload = () =>
{
    document.getElementById('p-button-login').addEventListener('click', VerifyMe);
}

function VerifyMe()
{
    let session = deew.GetCookieByName('__s');
    if(session == null)
        window.location.href = window.location.href.replace('/VERIFY', '');

    let pass = document.getElementById('p-input-password').value;
    let __json = {'q' : 'AUTHORISE_NEW', 'session' : session, 'password' : pass};
    deew.PostURL(api, __json, (code, res) =>
    {
        console.log(res);
        if(code == 200 && res.ok == true)
            window.location.href = window.location.href.replace('/VERIFY', '');
        else
            toastr["error"]("oh, looks like passwoed was wrong!", "Authorise State");
    });
}