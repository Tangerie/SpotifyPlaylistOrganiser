import SpotifyWebApi from 'spotify-web-api-node';
import { GLOBAL_PREFIX } from './constants.js';

import fs from "fs";
import { addToPlaylist, Arrayify, getTracksInPlaylist } from './util.js';

const PREFIX = GLOBAL_PREFIX + "sm_"

/**
 * 
 * @param {import('redis').RedisredisType} _redis 
 * @param {SpotifyWebApi} _spotify 
 */
export async function checkSummary() {
    await Promise.all(config.summary.to_watch.map(id => checkPlaylist(id)))
}

/**
 * 
 * @param {import('./index.js').PlaylistID} id 
 */
async function checkPlaylist(id) {
    const playlist = (await spotify.getPlaylist(id)).body;

    const p_id = PREFIX + playlist.id;
    const old_snapshot = await redis.get(p_id);

    if(old_snapshot != playlist.snapshot_id) {
        console.log(`${playlist.name} [${playlist.id}] Changed`);

        const to_add = (await getTracksInPlaylist(id)).map(t => t.track.uri);

        const res = await addToPlaylist(config.summary.target, to_add);

        if(res) {
            playlist.snapshot_id = res.body.snapshot_id;
        }
    } 

    await redis.set(p_id, playlist.snapshot_id);
}