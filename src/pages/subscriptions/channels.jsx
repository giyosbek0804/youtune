import { useYouTube } from "../../youtuneContext";
import React, { useEffect, useState } from "react";

function SubscriptionList() {
   const { subscriptions } = useYouTube();

   return (
     <div style={{ padding: "20px" }}>
       <h2>Subscriptions</h2>
       {subscriptions.length === 0 && <p>No subscriptions found.</p>}
       <ul>
         {subscriptions.map((sub) => (
           <li key={sub.id}>{sub.snippet.title}</li>
         ))}
       </ul>
     </div>
   );

}
export default SubscriptionList;
