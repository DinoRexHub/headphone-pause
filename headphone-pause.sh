#!/bin/bash

default_sink=$(pactl get-default-sink)

get_active_port() {
    pactl list sinks | awk "/Name: $default_sink/,/^$/" | grep "Active Port" | awk '{print $3}'
}

last_port=$(get_active_port)

while true; do
    current_port=$(get_active_port)

    if [[ "$current_port" != "$last_port" ]]; then
        if [[ "$last_port" == *"headphones"* && "$current_port" != *"headphones"* ]]; then
            playerctl pause
            pactl set-sink-mute @DEFAULT_SINK@ 1
            notify-send -i audio-headphones "Headphones unplugged" "Audio paused and muted"
        elif [[ "$last_port" != *"headphones"* && "$current_port" == *"headphones"* ]]; then
            pactl set-sink-mute @DEFAULT_SINK@ 0
            notify-send -i audio-volume-high "Headphones plugged in" "Audio unmuted"
        fi
        last_port=$current_port
    fi

    sleep 0.2
done

