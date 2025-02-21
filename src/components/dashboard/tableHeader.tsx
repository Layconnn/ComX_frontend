export default function TableHeader() {
  return (
    <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-600 mb-2">
      <div>Symbol</div>
      <div>Bid</div>
      <div>Ask</div>
      <div>Volume</div>
      <div>Last Price</div>
      <div>24h High</div>
      <div>24h Low</div>
    </div>
  );
}
