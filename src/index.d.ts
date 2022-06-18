import { RedisClientType } from "@redis/client";
import SpotifyWebApi from "spotify-web-api-node";

export type PlaylistID = string;
export type TrackID = string;
export type AllPlaylistID = "*"

export interface Config {
    summaries : {
        to_watch: PlaylistID[] | AllPlaylistID,
        target: PlaylistID,
        exclude?: PlaylistID[]
    }[],

    discover_weekly : {
        source: PlaylistID,
        target: PlaylistID
    }
}

declare global {
    var spotify : SpotifyWebApi;
    var redis : RedisClientType;
    var config : Config;
    var me : SpotifyApi.CurrentUsersProfileResponse;
}

export type AI<T> = T[] | T;