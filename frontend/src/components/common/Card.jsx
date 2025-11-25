export default function Card({ 
  title, 
  subtitle, 
  children, 
  className, 
  icon, 
  action, 
  loading = false,
  hover = true,
  gradient = false 
}) {
  return (
    <div
      className={
        `group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm p-6 shadow-xl shadow-slate-950/20 transition-all duration-300 ${
          hover ? 'hover:shadow-2xl hover:shadow-slate-950/30 hover:border-slate-700/50 hover:-translate-y-1' : ''
        } ${
          gradient ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/30' : ''
        } ${loading ? 'animate-pulse' : ''} ` +
        (className || "")
      }
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white group-hover:text-slate-50 transition-colors">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {action}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className={loading ? 'opacity-50' : ''}>
        {children}
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    </div>
  );
}

// Enhanced Card variants
export function StatsCard({ title, value, change, icon, trend = 'neutral', className }) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };
  
  return (
    <Card className={className} hover={true}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs ${trendColors[trend]} flex items-center gap-1 mt-1`}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-slate-400 opacity-60">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export function ActionCard({ title, description, action, icon, className }) {
  return (
    <Card className={`cursor-pointer ${className}`} hover={true}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
}