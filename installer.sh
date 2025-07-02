#!/bin/bash

set -e

SCRIPT_NAME="headphone-pause.sh"
SERVICE_NAME="headphone-pause.service"
BIN_DIR="$HOME/bin"
SYSTEMD_DIR="$HOME/.config/systemd/user"
USER_ID=$(id -u)
SCRIPT_PATH="$BIN_DIR/$SCRIPT_NAME"

echo "Installing headphone pause script..."

mkdir -p "$BIN_DIR"
cp "$SCRIPT_NAME" "$SCRIPT_PATH"
chmod +x "$SCRIPT_PATH"
echo "Copied $SCRIPT_NAME to $SCRIPT_PATH"

mkdir -p "$SYSTEMD_DIR"
cat > "$SYSTEMD_DIR/$SERVICE_NAME" <<EOF
[Unit]
Description=Pause audio when headphones unplug

[Service]
ExecStart=$SCRIPT_PATH
Restart=on-failure
Environment=DISPLAY=:0
Environment=XDG_RUNTIME_DIR=/run/user/$USER_ID

[Install]
WantedBy=default.target
EOF
echo "Created systemd service file at $SYSTEMD_DIR/$SERVICE_NAME"

systemctl --user daemon-reload
systemctl --user enable "$SERVICE_NAME"
systemctl --user start "$SERVICE_NAME"

echo "Installation complete. The headphone pause service is now running."
