import { useParams } from "react-router-dom";

function ChannelsShow() {
  const { channelId } = useParams();
  return (
    <>
      <h1>channel name {channelId}</h1>
    </>
  );
}
export default ChannelsShow;
