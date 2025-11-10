import { Route, Routes, BrowserRouter } from "react-router-dom";
import Shorts from "../pages/main/shorts";
import HomePage from "../pages/main/homePage";
import Content from "../pages/main/content";
import Subscriptions from "../pages/subscriptions/channels";
import You from "../pages/main/you";
import SubscriptionVideos from "../pages/subscriptions/channelVideos";
import History from "../pages/user info page/history";
import UserActivity from "../pages/user info page/userActivity";
import LikedVideos from "../pages/user info page/likedVideos";
import Playlist from "../pages/user info page/playlist";
import WatchLater from "../pages/user info page/watchLater";
import YourVideos from "../pages/user info page/yourVideos";
import YourCourses from "../pages/user info page/yourCourses";
import SubscriptionList from "../pages/subscriptions/channels";
import ChannelsRoute from "../pages/subscriptions/channelsRoute";
import ChannelsShow from "../pages/subscriptions/channelsShow";
import ExploreRoute from "../pages/explore/exploreRoute";
import Fashion from "../pages/explore/fashion&beauty";
import Gaming from "../pages/explore/gaming";
import Learning from "../pages/explore/learning";
import Live from "../pages/explore/live";
import Music from "../pages/explore/music";
import News from "../pages/explore/news";
import Sports from "../pages/explore/sports";
import YouTuneKids from "../pages/more youtube products/youtubeKids";
import YouTuneStudio from "../pages/more youtube products/youtubeStudio";
import VideoPlayer from "../components/videoPlayer";
function Pathes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Content />} />
          <Route path="shorts" element={<Shorts />} />
          <Route path="subscriptions" element={<SubscriptionVideos />} />
          <Route path="you" element={<UserActivity />}>
            <Route index element={<You />} />
            <Route path="history" element={<History />} />
            <Route path="playlist" element={<Playlist />} />
            <Route path="yourvideos" element={<YourVideos />} />
            <Route path="yourcourses" element={<YourCourses />} />
            <Route path="watchlater" element={<WatchLater />} />
            <Route path="likedvideos" element={<LikedVideos />} />
          </Route>
          <Route path="subscriptionslist" element={<ChannelsRoute />}>
            <Route index element={<SubscriptionList />} />
            <Route path=":channelId" element={<ChannelsShow />} />
          </Route>
          <Route path="explore" element={<ExploreRoute />}>
            <Route path="fashion" element={<Fashion />} />
            <Route path="gaming" element={<Gaming />} />
            <Route path="learning" element={<Learning />} />
            <Route path="live" element={<Live />} />
            <Route path="music" element={<Music />} />
            <Route path="news" element={<News />} />
            <Route path="sport" element={<Sports />} />
          </Route>
          <Route path="kids" element={<YouTuneKids />} />
          <Route path="studio" element={<YouTuneStudio />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Pathes;
