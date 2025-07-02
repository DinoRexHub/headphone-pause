'use strict';

const { GObject, St, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

var HeadphonePauseExtension = GObject.registerClass(
class HeadphonePauseExtension extends PanelMenu.Button {
    _init() {
        super._init(0.0, "Headphone Pause");

        this.icon = new St.Icon({
            icon_name: 'audio-headphones-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(this.icon);

        this._toggle = new PopupMenu.PopupSwitchMenuItem("Pause audio on unplug", false);
        this._toggle.connect('toggled', (item, state) => {
            this._togglePause(state);
        });
        this.menu.addMenuItem(this._toggle);

        this._process = null;
    }

    _togglePause(enabled) {
        if (enabled) {
            this._startScript();
        } else {
            this._stopScript();
        }
    }

    _startScript() {
        if (this._process)
            return;  // Already running

        try {
            let [success, pid] = GLib.spawn_async(
                null,
                ['/home/adity/bin/headphone-pause.sh'],
                null,
                GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                null
            );

            if (success) {
                this._process = pid;
                GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                    this._process = null;
                    this._toggle.setToggleState(false);
                });
            } else {
                log('Failed to start headphone-pause script');
                this._toggle.setToggleState(false);
            }
        } catch (e) {
            log('Exception starting headphone-pause script: ' + e.message);
            this._toggle.setToggleState(false);
        }
    }

    _stopScript() {
        if (this._process) {
            try {
                GLib.spawn_command_line_sync(`kill ${this._process}`);
                this._process = null;
            } catch (e) {
                log('Error killing headphone-pause script: ' + e.message);
            }
        }
    }

    destroy() {
        this._stopScript();
        super.destroy();
    }
});

let headphonePauseExtension = null;

function init() {}

function enable() {
    headphonePauseExtension = new HeadphonePauseExtension();
    Main.panel.addToStatusArea('headphone-pause', headphonePauseExtension);
}

function disable() {
    if (headphonePauseExtension) {
        headphonePauseExtension.destroy();
        headphonePauseExtension = null;
    }
}
