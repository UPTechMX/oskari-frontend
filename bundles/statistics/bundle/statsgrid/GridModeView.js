/**
 * @class Oskari.statistics.bundle.statsgrid.GridModeView
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.GridModeView',
/**
 * @static constructor function
 */
function() {
}, {

    /**
     * @method startPlugin
     * called by host to start view operations
     */
    startPlugin: function() {
        var me = this;
        var sandbox = me.instance.getSandbox();

        this.toolbar = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatsToolbar', {
            title: me.getTitle()
        }, this.instance);

//TODO: TOOLBAR -> mapdiv height - toolbar height



        this.requestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.StatsGridRequestHandler', me);
        sandbox.addRequestHandler('StatsGrid.StatsGridRequest', this.requestHandler);

        var el = me.getEl();
        el.addClass("statsgrid");

    },
    showMode: function(isShown, blnFromExtensionEvent) {
        var sandbox = this.instance.getSandbox();
        this.toolbar.show(isShown);

        var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
        var map = mapModule.getMap();


        if (isShown) {
            /** ENTER The Mode */

            /** set map to stats mode - map-ops -> statslayer tools should propably tell us where to zoom */
//            this._setMapStatsMode();

            jQuery('#contentMap').addClass('statsgrid-contentMap');
            jQuery('.oskariui-mode-content').addClass('statsgrid-mode');
            var leftWidth = 57;

            /** show our mode view - view hacks */
            var elCenter = this.getCenterColumn();
            elCenter.removeClass('span12');
            elCenter.width((100 - 57) + '%');//.addClass('span5');
            jQuery('#mapdiv').height(jQuery(window).height() - jQuery('#contentMap').find('.oskariui-menutoolbar').height());
            //window resize is handled in mapfull - instance.js

            var elLeft = this.getLeftColumn();
            elLeft.removeClass('oskari-closed');
            elLeft.width(leftWidth + '%');//.addClass('span7');

            /** a hack to notify openlayers of map size change */
            map.updateSize();

        } else {
            /** EXIT The Mode */

            /** set map to stats mode */
//            this._setMapNormalMode();

            jQuery('#contentMap').removeClass('statsgrid-contentMap');
            jQuery('.oskariui-mode-content').removeClass('statsgrid-mode');
            
            var elCenter = jQuery('.oskariui-center');
            //elCenter.removeClass('span5');
            //elCenter.addClass('span12');
            elCenter.width('').addClass('span12');
            jQuery('#mapdiv').height(jQuery(window).height());

            var elLeft = jQuery('.oskariui-left');
            elLeft.addClass('oskari-closed');
            elLeft.width('');//removeClass('span7');

            if(!blnFromExtensionEvent) {
                // reset tile state if not triggered by tile click
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
            }

            /** a hack to notify openlayers of map size change */
            map.updateSize();

        }

    },
    getLeftColumn : function() {
        return jQuery('.oskariui-left');
    },
    getCenterColumn : function() {
        return jQuery('.oskariui-center');
    },
    getRightColumn : function() {
        return jQuery('.oskariui-right');
    },
    /**
     * @method stopPlugin
     * called by host to stop view operations
     */
    stopPlugin: function() {
        this.toolbar.destroy();
        sandbox.removeRequestHandler('StatsGrid.StatsGridRequest', this.requestHandler);
    }
}, {
    "protocol": ["Oskari.userinterface.View"],
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});