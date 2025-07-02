const { GObject, St, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const MessageTray = imports.ui.messageTray;

var HeadphonePauseExtension = GObject.registerClass(
class HeadphonePauseExtension extends PanelMenu.Button {
    _init() {
        super._init(0.0, "Headphone Pause");

        this.icon = new St.Icon({
            icon_name: 'audio-headphones-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(this.icon);

        this._source = new MessageTray.Source("Headphone Pause", 'audio-headphones-symbolic');
        Main.messageTray.add(this._source);

        this._toggle = new PopupMenu.PopupSwitchMenuItem("Pause audio on unplug", false);
        this._toggle.connect('toggled', (item, state) => {
            this._togglePause(state);
        });
        this.menu.addMenuItem(this._toggle);
    }

    _showNotification(title, body) {
        let notification = new MessageTray.Notification(this._source, title, { body: body });
        this._source.notify(notification);
    }

    _togglePause(enabled) {
        let action = enabled ? 'start' : 'stop';
        let cmd = ['systemctl', '--user', action, 'headphone-pause.service'];

        try {
            let [res, pid] = GLib.spawn_async(null, cmd, null, GLib.SpawnFlags.DO_NOT_REAP_CHILD, null);
            GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                if (status === 0)
                    this._showNotification("Headphone Pause", enabled ? "Enabled" : "Disabled");
                else
                    this._showNotification("Headphone Pause", "Failed to " + action);
            });
        } catch (e) {
            this._showNotification("Headphone Pause", "Error: " + e.message);
        }
    }

    destroy() {
        this.menu.removeAll();
        //Main.messageTray.remove(this._source);
        super.destroy();
    }
});

let headphonePause;

function init() {}

function enable() {
    headphonePause = new HeadphonePauseExtension();
    Main.panel.addToStatusArea('headphone-pause', headphonePause);
}

function disable() {
    if (headphonePause) {
        headphonePause.destroy();
        headphonePause = null;
    }
}
