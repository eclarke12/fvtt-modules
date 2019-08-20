( () => {
    Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
	        const windowHeader = html.parent().parent().find(".window-header");
            const windowCloseBtn = windowHeader.find(".close");
            const ddbLogo = "https://www.dndbeyond.com/Content/1-0-514-0/Skins/Waterdeep/images/dnd-beyond-b-red.png"
            const imgStyle = `display:inline-block;vertical-align:middle;height:16px`;
            //const imgStyle = `height:16px`;
            const aStyle = `display:inline-block;vertical-align:baseline`;
            //const aStyle = ""
            const ddbButton = $(`<a class="ddb-popup" style=${aStyle}><img src=${ddbLogo} style=${imgStyle}> DDB</a>`);
            let ddbUrl = "https://www.dndbeyond.com/profile/errational/characters/15260756"
            
            windowHeader.find('.ddb-popup').remove();
            windowCloseBtn.before(ddbButton);

            // Handle button clicks
            ddbButton.click(ev => {
                ev.preventDefault();
                let existingPopup = window.open("", "ddb-popup", "resizeable,scrollbars,location=no,width=768,height=1024");

                if(existingPopup.location.href == "about:blank"){
                    existingPopup.location = ddbUrl;
                } else {
                    window.open("","ddb-popup",);
                }
            });
        });
})();