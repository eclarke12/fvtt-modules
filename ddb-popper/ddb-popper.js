Hooks.on("ready", () => {
    ddbPopper = new DDBPopper();
});

class DDBPopper {
    constructor(){

    }

    CONFIG = {
        ddbLogo: "https://www.dndbeyond.com/Content/1-0-514-0/Skins/Waterdeep/images/dnd-beyond-b-red.png",
        imgStyle: `display:inline-block;vertical-align:middle;height:16px`,
        aStyle: `display:inline-block;vertical-align:baseline`
    }

    _hookRenderActorSheet() {
        Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
            this._addDDBButton(html, data)
        });
    }

    _addDDBButton (html, data) {
        const windowHeader = html.parent().parent().find(".window-header");
        const windowCloseBtn = windowHeader.find(".close");
        const ddbButton = $(`<a class="ddb-popup" style=${this.CONFIG.aStyle}><img src=${this.CONFIG.ddbLogo} style=${this.CONFIG.imgStyle}> DDB</a>`);
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

        ddbButton.contextmenu(ev => {
            ev.preventDefault();
            ddbURLForm = new DDBURLEntryForm(data, {closeOnSubmit: true});
            ddbURLForm.render();
        });
    }

    async _updateActor (actor, data) {
        await actor.update(data);
    }
}
    
class DDBURLEntryForm extends FormApplication {
    constructor(object, options){
        super.constructor(object, options);
    }


}