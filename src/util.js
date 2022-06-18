/**
 * @template T
 * @param {T[] | T} items 
 * @returns {T[]}
 */
export function Arrayify(items) {
    if(!Array.isArray(items)) {
        return [items];
    }
    return items;
}


export function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}

export async function getAllInPage(fn_name, args, opts={}) {
    let total = [];

    let res;
    opts.offset = opts.offset ?? 0;

    do {
        res = await spotify[fn_name](...args, opts);
        
        opts.offset += res.body.limit;
        total = [...total, ...res.body.items];
    } while(res.body.next)

    return total;
}

/**
 * 
 * @param {string} playlist_id 
 * @returns {Promise<SpotifyApi.PlaylistTrackObject[]>}
 */
export async function getTracksInPlaylist(playlist_id) {
    return await getAllInPage("getPlaylistTracks", [playlist_id]);
}

/**
 * 
 * @param {string} playlist_id 
 * @param {string[]} _tracks 
 */
export async function addToPlaylist(playlist_id, _tracks) {
    let tracks = (await getTracksInPlaylist(playlist_id)).map(t => t.track.uri);

    const to_add = _tracks.filter(t => !tracks.includes(t));

    if(to_add.length == 0) {
        return null;
    }

    return spotify.addTracksToPlaylist(playlist_id, to_add);
}

/**
 * 
 * @param {Date} date
 */
export function dateToString(date) {
    let s = "";

    s += date.getDate().toString().padStart(2, '0');
    s += "/"
    s += (date.getMonth() + 1).toString().padStart(2, '0');
    s += "/"
    s += date.getFullYear();

    return s;
}