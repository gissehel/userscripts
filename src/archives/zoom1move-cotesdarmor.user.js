// ==UserScript==
// @description     Auto Zoom 1 + mouse = move
// @match           https://sallevirtuelle.cotesdarmor.fr/EC/ecx/consult.aspx?*
// @iconFromDomain  cotesdarmor.fr
// ==/UserScript==

// @import{delay}
// @import{readyPromise}

readyPromise
    .then(() => delay(500))
    .then(() => {
        DoTool('move');
        ZoomerPhoto(1);
    })
