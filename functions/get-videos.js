// functions/get-videos.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
    const q = event.queryStringParameters?.q || "music";
    const pageToken = event.queryStringParameters?.pageToken || "";

    const key = process.env.YOUTUBE_API_KEY; // secret, never exposed to client

    try {
        // Fetch most popular videos
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=24&order=viewCount&key=${key}&pageToken=${pageToken}`;
        const res = await fetch(url);
        const data = await res.json();

        // Fetch channel thumbnails
        const channelIds = [...new Set((data.items || []).map(v => v.snippet.channelId))].join(",");
        let channelMap = {};
        if (channelIds) {
            const chRes = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${key}`
            );
            const chData = await chRes.json();
            (chData.items || []).forEach((ch) => {
                channelMap[ch.id] = ch.snippet?.thumbnails?.default?.url || "";
            });
        }

        const itemsWithChannels = (data.items || []).map((v) => ({
            ...v,
            channelThumbnail: channelMap[v.snippet.channelId] || "",
        }));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: itemsWithChannels,
                nextPageToken: data.nextPageToken || "",
            }),
        };
    } catch (err) {
        console.error("Error in Netlify function:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch videos" }),
        };
    }
};
