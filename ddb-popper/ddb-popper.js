Hooks.on("ready", () => {
    let ddbPopper = new DDBPopper();
});

class DDBPopper {
    constructor(){
        this._hookRenderActorSheet();
    }

    CONFIG = {
        ddbLogo: "https://www.dndbeyond.com/Content/1-0-518-0/Skins/Waterdeep/images/dnd-beyond-b-red.png",
        imgStyle: `display:inline-block;vertical-align:middle;height:16px`,
        aStyle: `display:inline-block;vertical-align:baseline`
    }

    _hookRenderActorSheet() {
        Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
            console.log("app:",app,"html:",html,"data:",data);
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
            let existingPopup = window.open("", "ddb-popup", "resizeable,scrollbars,location=no,width=768,height=968");

            if(existingPopup.location.href == "about:blank"){
                existingPopup.location = ddbUrl;
            } else {
                window.open("","ddb-popup",);
            }
        });

        ddbButton.contextmenu(ev => {
            ev.preventDefault();
            new DDBURLEntryForm(data, {closeOnSubmit: true}).render(true);
        });
    }

    async _updateActor (actor, data) {
        const flags = {
            "flags": {
                "ddb-popper.ddbURL": data
            }
        }
        await actor.update(flags,{displaySheet: false});
    }
}
    
class DDBURLEntryForm extends FormApplication {
    constructor(...options){
        super(...options);
        console.log(...options);
        this.data = options[0];
        }
  
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "ddb-url",
            title: "D&D Beyond URL",
            template: "public/modules/ddb-popper/template/ddb-popper.html",
            classes: ["sheet"],
            width: 500
        });
    }


    /**
     * for a given actor (by id), find the setting
     */
    async getData() {
        return {
            settings: game.settings.get("ddb-popper", this.data.id)
        };
    }

    _updateObject(event, formData) {
        try {
            game.settings.set("ddb-popper", this.data.id, formdata.ddbURL);
        } catch (e) {
            if(e.message == "That is not a registered game setting") {
                game.settings.register("ddb-popper", this.data.id, formdata.ddbURL);
            }
        }
        
    }

}