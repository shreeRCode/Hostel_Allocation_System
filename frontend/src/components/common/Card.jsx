export default function Card({ title, subtitle, children, className }) {
  return (
    <div
      className={
        "rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow " +
        (className || "")
      }
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}
