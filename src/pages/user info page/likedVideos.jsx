import { useYouTube } from "../../youtuneContext";

function LikedVideos() {
    const { likes } = useYouTube();

    return (
      <div style={{ padding: "20px" }}>
        <h2 className="text-primary1">Liked Videos</h2>
        {likes.length === 0 && (
          <p className="text-primary1">No liked videos found.</p>
        )}
        <ul>
          {likes.map((video) => (
            <li key={video.id}>{video.snippet.title}</li>
          ))}
        </ul>
      </div>
    );
}
export default LikedVideos;