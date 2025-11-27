export default function QuoteUsage() {
  const data = [
    {
      feature: "Search",
      api: "search.list",
      cost: 100,
    },
    {
      feature: "Category Filter",
      api: "search.list",
      cost: 100,
    },
    {
      feature: "Homepage Feed",
      api: "search.list",
      cost: 100,
    },
    {
      feature: "Video Details",
      api: "videos.list",
      cost: 1,
    },
    {
      feature: "Channel Info",
      api: "channels.list",
      cost: 1,
    },
    {
      feature: "Related Videos",
      api: "search.list",
      cost: 100,
    },
    {
      feature: "History / Likes",
      api: "None",
      cost: 0,
    },
  ];

    return (
      <>
        <table className="table-auto border-collapse w-fit text-left">
          <thead>
            <tr className="text-[clamp(1rem,1.1vw,2.6rem)] ">
              <th className="border p-2 ">Feature</th>
              <th className="border p-2">API Used</th>
              <th className="border p-2">Quota Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="text-[clamp(.9rem,1vw,2.5rem)]">
                <td className="border p-2 ">{item.feature}</td>
                <td className="border p-2">{item.api}</td>
                <td className="border p-2">{item.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
          <span className="text-[clamp(.9rem,1.1vw,2.7rem)] px-[calc(2rem+1.5vw)] py-[calc(.4rem+.5vw)]  w-full ">
            (quote resets tomorrow at 1PM)
          </span>
      </>
    );
}
