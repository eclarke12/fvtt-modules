Hooks.on("ready", () => {
    let ddbPopper = new DDBPopper();
});

class DDBPopper {
    constructor(){
        this._hookRenderActorSheet();
        this.existingPopup = null;
    }

    CONFIG = {
        ddbLogo: "modules/ddb-popper/icons/dnd-beyond-b-red.png",
        imgStyle: `display:inline-block;vertical-align:middle;height:16px`,
        aStyle: `display:inline-block;vertical-align:baseline`
    }

    static get SETTINGS_META() {
        return {
            name: "ddbCharacterURL",
            type: String,
            scope: "world",
            default: "",
            onChange: s => {
                console.log("new setting:",s);
                //rerender the open actor sheet
            }
        }
    }

    _hookRenderActorSheet() {
        Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
            this._getActorDDBURL(data);
            console.log("app:",app,"html:",html,"data:",data);
            this._addDDBButton(html, data);
        });
    }

    async _getActorDDBURL(data) {
        let ddbURL;

        try {
            ddbURL = await game.settings.get("ddb-popper", data.actor._id);
        } catch (e) {
            if(e.message == "This is not a registered game setting") {
                ddbURL = null;
            } else {
                throw(e);
            }
        } finally {
            return ddbURL;
        }
    }

    async _addDDBButton (html, data) {
        const windowHeader = html.parent().parent().find(".window-header");
        const windowCloseBtn = windowHeader.find(".close");
        const ddbButton = $(`<a class="ddb-popup" style=${this.CONFIG.aStyle}><img src=${this.CONFIG.ddbLogo} style=${this.CONFIG.imgStyle}> DDB</a>`);
        const actorDDBURL = await this._getActorDDBURL(data);
        
        windowHeader.find('.ddb-popup').remove();
        windowCloseBtn.before(ddbButton);

        // Handle button clicks
        ddbButton.click(ev => {
            ev.preventDefault();

            if ((this.existingPopup == null || this.existingPopup.closed) && actorDDBURL == null){
                new DDBURLEntryForm(data, {closeOnSubmit: true}).render(true);
            } else if ((this.existingPopup == null || this.existingPopup.closed) && actorDDBURL.length > 0) {
                this.existingPopup = window.open(actorDDBURL, "ddb-popup", "resizeable,scrollbars,location=no,width=768,height=968");
            } else {
                this.existingPopup.focus();
            }
        });

        ddbButton.contextmenu(ev => {
            ev.preventDefault();
            new DDBURLEntryForm(data, {closeOnSubmit: true}).render(true);
        });
    }
}
    
class DDBURLEntryForm extends FormApplication {
    constructor(...options){
        super(...options);
        console.log(...options);
        this.data = options[0];
        this.actorId = this.data.actor._id;
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
        const data = {};
        try {
            data.ddbCharacterURL = game.settings.get("ddb-popper", this.actorId);
        } catch (e) {
            if (e.message == "This is not a registered game setting") {
                data.ddbCharacterURL = "";
            } else {
                throw(e);
            }
        }
        finally {
            return data 
        }
    }

    async _updateObject(event, formData) {
        console.log(event,formData);
        try {
            //game.settings.set("ddb-popper", this.actorId, formData.ddbCharacterURL);
            await game.settings.get("ddb-popper", this.actorId);
        } catch (e) {
            if(e.message == "This is not a registered game setting") {
                await game.settings.register("ddb-popper", this.actorId, DDBPopper.SETTINGS_META);
            } else {
                throw(e);
            }
            
        } finally {
            game.settings.set("ddb-popper", this.actorId, formData.ddbCharacterURL);
            //rerender actor sheet
        }
        
    }

}