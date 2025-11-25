import { Link } from "react-router-dom";

export default function SubscriptionVideos() {
  return (
    <>
      <Link
        to={"/subscriptionslist"}
        className=" bg-border px-[calc(.8rem+1vw)] py-[calc(.2rem+.2vw)] rounded-[20px] "
      >
        <h3> see all Subscriptions</h3>
      </Link>
      <h1>subscriptions videos under development</h1>
    </>
  );
}
