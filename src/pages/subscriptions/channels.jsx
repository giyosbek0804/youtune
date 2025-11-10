import { useYouTube } from "../../youtuneContext";

function SubscriptionList() {
  const { subscriptions } = useYouTube();
  console.log(subscriptions + "hh");

  return (
    <>
      <h1>All channels </h1>
      {subscriptions.map((sub) => (
        <div key={sub.id} className="bg-gray-900 p-2 rounded-lg shadow">
          <img
            src={sub.snippet.thumbnails.default.url}
            alt={sub.snippet.title}
            className="rounded-lg"
          />
          <p className="text-sm mt-2">{sub.snippet.title}</p>
          <p>{sub}</p>
          
        </div>
        
      ))}
    </>
  );
}
export default SubscriptionList;
