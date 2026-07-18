// Slow-scrolling strip of the things that fill my days.
const ITEMS = [
  "data pipelines",
  "apis",
  "spark",
  "kafka",
  "snowflake",
  "databricks",
  "airflow",
  "rust",
  "scala",
  "compilers",
  "chess",
  "conway's life",
];

export default function Marquee() {
  const row = ITEMS.map((item, i) => (
    <span className="marquee-item" key={i}>
      {item} <span className="marquee-dot">▪</span>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-row">{row}</div>
        <div className="marquee-row">{row}</div>
      </div>
    </div>
  );
}
