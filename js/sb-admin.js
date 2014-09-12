var LinkServer = null;

$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
$(function() {  //54.85.90.175
    // LinkServer = new Linker("http://console.soluntech.com/informator");
    LinkServer = new Linker("http://54.85.172.192/informator");
    // LinkServer = new Linker("http://localhost/informator");
    LinkServer.setExtension(".json?");
    
    $(window).bind("load resize", function() {
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.sidebar-collapse').addClass('collapse')
        } else {
            $('div.sidebar-collapse').removeClass('collapse')
        }
    })
})
