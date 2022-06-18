import fetch from 'node-fetch';
import { addToPlaylist, dateToString } from './util.js';

const PREFIX = "weekly:"



export async function checkWeekly() {
    const weekly = await spotify.getPlaylist(config.discover_weekly.source);
    const id = PREFIX + weekly.body.id;
    const old_snapshot = await redis.get(id);

    if(old_snapshot != weekly.body.snapshot_id) {
        console.log("Discover Weekly Updated");

        const res = await addToPlaylist(
            config.discover_weekly.target, 
            weekly.body.tracks.items.map(x => x.track.uri)
        );

        
        if(res) {
            await updateCover();

            await spotify.changePlaylistDetails(config.discover_weekly.target,
                {
                    description: "Updated on " + dateToString(new Date())
                }
            )
    
            // await redis.set(PREFIX + config.discover_weekly.target, res.body.snapshot_id);
        }

        await redis.set(id, weekly.body.snapshot_id);
    }

}

async function updateCover() {
    const weekly = (await spotify.getPlaylist(config.discover_weekly.source)).body;

    const img = await (await fetch(weekly.images.at(0).url)).blob();

    const blob = await img.arrayBuffer();
    const b64 = Buffer.from(blob).toString("base64");

    await spotify.uploadCustomPlaylistCoverImage(config.discover_weekly.target, b64);
}