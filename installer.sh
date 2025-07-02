#!/bin/bash

set -e

# Define variables
SCRIPT_NAME="headphone-pause.sh"
SERVICE_NAME="headphone-pause.service"
BIN_DIR="$HOME/bin"
SYSTEMD_DIR="$HOME/.config/systemd/user"
USER_ID=$(id -u)
SCRIPT_PATH="$BIN_DIR/$SCRIPT_NAME"

echo "Installing headphone pause script..."

# Create bin directory if it doesn't exist
mkdir -p "$BIN_DIR"

# Copy the script to ~/bin
cp "$SCRIPT_NAME" "$SCRIPT_PATH"
chmod +x "$SCRIPT_PATH"
echo "Copied $SCRIPT_NAME to $SCRIPT_PATH"

# Create systemd user directory if it doesn't exist
mkdir -p "$SYSTEMD_DIR"

# Create systemd service file
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

# Reload systemd daemon and enable/start service
systemctl --user daemon-reload
systemctl --user enable "$SERVICE_NAME"
systemctl --user start "$SERVICE_NAME"

echo "Installation complete. The headphone pause service is now running."

