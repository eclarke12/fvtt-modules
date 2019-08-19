( () => {
    Hooks.on('renderActorSheet5eCharacter', (app, html, data) => {

	    const windowHeader = html.parent().parent().find('.window-header');
        const windowCloseBtn = windowHeader.find('.close');
        const importButton = $('<a class="ddb-popup"><img src="https://www.dndbeyond.com/Content/1-0-514-0/Skins/Waterdeep/images/dnd-beyond-b-red.png" height="15px"/> DDB</a>');

        windowHeader.find('.ddb-popup').remove();
         windowCloseBtn.before(importButton);

        // Handle button clicks
        importButton.click(ev => {
            ev.preventDefault();
            window.open("https://www.dndbeyond.com/profile/errational/characters/15260756","ddb-popup","resizeable,scrollbars")
        });
    });
})();