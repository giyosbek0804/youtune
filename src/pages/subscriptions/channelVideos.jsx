import { Link } from "react-router-dom";

export default function SubscriptionVideos() {
  return (
    <>
      <h1 className="text-primary1 py-[calc(.5rem+.5vw)]" >subscriptions videos under development</h1>
      <Link
        to={"/subscriptionslist"}
        className=" bg-border px-[calc(.8rem+1vw)] py-[calc(.2rem+.2vw)] rounded-[20px] "
      >
        <h3 className="text-primary1"> see all Subscriptions</h3>
      </Link>
    </>
  );
}
