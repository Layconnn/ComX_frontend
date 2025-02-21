export default function TableRows() {
  const data = [
    {
      symbol: "AAPL",
      bid: "172.34",
      ask: "172.39",
      volume: "1.23M",
      lastPrice: "172.37",
      high: "173.40",
      low: "170.90",
    },
    {
      symbol: "MSFT",
      bid: "332.01",
      ask: "332.06",
      volume: "2.42M",
      lastPrice: "332.04",
      high: "335.90",
      low: "330.10",
    },
    {
      symbol: "TSLA",
      bid: "256.98",
      ask: "257.10",
      volume: "4.77M",
      lastPrice: "257.05",
      high: "261.50",
      low: "250.70",
    },
    {
      symbol: "GOOG",
      bid: "133.11",
      ask: "133.15",
      volume: "3.56M",
      lastPrice: "133.12",
      high: "135.90",
      low: "130.60",
    },
    {
      symbol: "AMZN",
      bid: "121.34",
      ask: "121.39",
      volume: "5.12M",
      lastPrice: "121.37",
      high: "123.50",
      low: "119.90",
    },
    {
      symbol: "NVDA",
      bid: "389.01",
      ask: "389.06",
      volume: "1.89M",
      lastPrice: "389.04",
      high: "394.70",
      low: "385.20",
    },
  ];

  return (
    <>
      {data.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-7 gap-2 text-sm py-2 hover:bg-[#F8FAFB]"
        >
          <div>{item.symbol}</div>
          <div>{item.bid}</div>
          <div>{item.ask}</div>
          <div>{item.volume}</div>
          <div>{item.lastPrice}</div>
          <div>{item.high}</div>
          <div>{item.low}</div>
        </div>
      ))}
    </>
  );
}
