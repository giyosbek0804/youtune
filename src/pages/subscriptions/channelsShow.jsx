import { useParams } from "react-router-dom";

function ChannelsShow() {
  const { channelId } = useParams();
  return (
    <>
      <h1> {channelId} channel under development </h1>
    </>
  );
}
export default ChannelsShow;
