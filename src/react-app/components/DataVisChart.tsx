import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface ChartData {
  type: 'bar' | 'pie' | 'line';
  data: any[];
  title?: string;
  xKey?: string;
  yKey?: string;
  labelKey?: string;
  valueKey?: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function DataVisChart({ type, data, title, xKey = 'name', yKey = 'value', valueKey = 'value' }: ChartData) {
  
  if (type === 'bar') {
    return (
      <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10">
        {title && <h3 className="text-white font-bold text-lg mb-4 text-center">{title}</h3>}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey={xKey} stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey={yKey} fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  if (type === 'pie') {
    return (
      <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10">
        {title && <h3 className="text-white font-bold text-lg mb-4 text-center">{title}</h3>}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey={valueKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  if (type === 'line') {
    return (
      <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10">
        {title && <h3 className="text-white font-bold text-lg mb-4 text-center">{title}</h3>}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey={xKey} stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey={yKey} stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return null;
}
