import SpotifyWebApi from 'spotify-web-api-node';

import { addToPlaylist, Arrayify, getTracksInPlaylist } from './util.js';

const PREFIX = "summary:"

export async function checkSummary() {
    for(const summary of config.summaries) {
        let to_watch = summary.to_watch;

        if(to_watch == '*') {
            to_watch = (await spotify.getUserPlaylists()).body.items
                .filter(p => p.owner.id == me.id && p.id != summary.target)
                .map(p => p.id);
        }

        if(summary.exclude) {
            to_watch = to_watch.filter(x => !summary.exclude.includes(x));
        }

        for(const playlist of to_watch) {
            await checkPlaylist(playlist, summary.target);
        }
    }
}

/**
 * 
 * @param {import('./index.js').PlaylistID} id 
 * @param {import('./index.js').PlaylistID} target_id 
 */
async function checkPlaylist(id, target_id) {
    const playlist = (await spotify.getPlaylist(id)).body;

    const p_id = PREFIX + playlist.id;
    const old_snapshot = await redis.get(p_id);

    if(old_snapshot != playlist.snapshot_id) {
        console.log(`${playlist.name} [${playlist.id}] Changed`);

        const to_add = (await getTracksInPlaylist(id))
            .filter(t => !t.is_local)
            .map(t => t.track.uri);

        const res = await addToPlaylist(target_id, to_add);

        
        if(res) {
            console.log(`${to_add.length} New Songs`);
            playlist.snapshot_id = res.body.snapshot_id;
        }
    } 

    await redis.set(p_id, playlist.snapshot_id);
}