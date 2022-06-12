import { RedisClientType } from "@redis/client";
import SpotifyWebApi from "spotify-web-api-node";

export type PlaylistID = string;
export type TrackID = string;

export interface Config {
    summary : {
        to_watch: PlaylistID[],
        target: PlaylistID
    },

    discover_weekly : {
        source: PlaylistID,
        target: PlaylistID
    }
}

declare global {
    var spotify : SpotifyWebApi;
    var redis : RedisClientType;
    var config : Config;
}

export type AI<T> = T[] | T;