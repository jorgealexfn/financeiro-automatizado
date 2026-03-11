import React, { useMemo } from 'react';
import type { MonthData } from '../App';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, ReferenceLine
} from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface DashboardProps {
    data: MonthData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {

    const chartData = useMemo(() => {
        return data.map(m => {
            const row: Record<string, any> = { name: m.month };
            // Flatten the JSON values out
            if (m.values) {
                Object.keys(m.values).forEach(catId => {
                    row[catId] = m.values[catId];
                });
            }
            return row;
        });
    }, [data]);

    const insights = useMemo(() => {
        if (data.length === 0) return { alerts: [], savings: null };

        const alerts: string[] = [];
        let totalExpensesAno = 0;
        let totalRestoAno = 0;

        data.forEach(m => {
            if (!m.values) return;

            // Reconstruct the logic based on standard keys or dynamic iteration
            const income = m.values['cat_soldo'] || 0;
            const expense = (m.values['cat_nubank'] || 0) + (m.values['cat_claro'] || 0) + (m.values['cat_aluguel'] || 0) + (m.values['cat_tay'] || 0) + (m.values['cat_faculdade'] || 0) + (m.values['cat_imprevistos'] || 0);
            const resto = income - expense;

            totalExpensesAno += expense;
            totalRestoAno += resto;

            if (resto < 0) {
                alerts.push(`O saldo em ${m.month} está negativo!`);
            } else if (resto > 0 && resto < (income * 0.1)) {
                alerts.push(`Atenção: Sobrou menos de 10% da entrada principal em ${m.month}.`);
            }
        });

        const savingsSuggestion = {
            reduction: totalExpensesAno * 0.10,
            newResto: totalRestoAno + (totalExpensesAno * 0.10)
        };

        return { alerts, savings: savingsSuggestion };
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-white">Adicione meses na Planilha</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">
                    Preencha os dados na "Planilha Viva" primeiro para visualizar o Analytics de seu ano financeiro.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Savings Suggestion Card */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                        <Lightbulb size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Lightbulb size={24} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Sugestão de Economia</h3>
                    </div>
                    <p className="text-green-50 text-sm mb-2 opacity-90">
                        Pequenas mudanças geram grande impacto no fim do ano.
                    </p>
                    <div className="bg-black/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                        <p className="font-medium text-[15px] leading-relaxed">
                            Se você reduzir os seus <strong>Custos</strong> em <span className="bg-white text-green-700 px-1 py-0.5 rounded text-sm font-bold">10%</span>,
                            seu caixa anual acumulará cerca de <strong className="text-green-100 text-xl block mt-1">R$ {insights.savings?.newResto.toFixed(2)}</strong>
                        </p>
                    </div>
                </div>

                {/* Alerts Card */}
                <div className={`rounded-xl shadow-md p-6 relative overflow-hidden transition-colors ${insights.alerts.length > 0
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600'
                    }`}>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                        <AlertTriangle size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`${insights.alerts.length > 0 ? 'bg-white/20' : 'bg-slate-300/50'} p-2 rounded-lg backdrop-blur-sm`}>
                            <AlertTriangle size={24} className={insights.alerts.length > 0 ? 'text-white' : 'text-slate-600'} />
                        </div>
                        <h3 className="text-lg font-semibold">Alertas de Orçamento</h3>
                    </div>

                    {insights.alerts.length > 0 ? (
                        <ul className="space-y-2">
                            {insights.alerts.map((alert, idx) => (
                                <li key={idx} className="bg-black/10 rounded-lg p-3 backdrop-blur-sm border border-white/10 flex items-start gap-2 text-sm font-medium">
                                    <TrendingDown size={18} className="shrink-0 mt-0.5" />
                                    {alert}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4 bg-white/50 rounded-lg text-center h-[120px]">
                            <p className="font-medium text-slate-800">Tudo sob controle! 🎉</p>
                            <p className="text-sm text-slate-600 mt-1">Nenhum mês negativo ou com saldo abaixo de 10%.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Evolução Resto Line Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-blue-500 dark:text-blue-400" size={20} />
                        Tendência Anual do Resto Livre
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any, name: any, props: any) => {
                                        // Re-calculate the resto inline just for the tooltip or use derived data
                                        const m = props.payload;
                                        const income = m['cat_soldo'] || 0;
                                        const expense = (m['cat_nubank'] || 0) + (m['cat_claro'] || 0) + (m['cat_aluguel'] || 0) + (m['cat_tay'] || 0) + (m['cat_faculdade'] || 0) + (m['cat_imprevistos'] || 0);
                                        const restoCalculated = income - expense;
                                        return [`R$ ${Number(restoCalculated).toFixed(2)}`, 'Saldo Livre'];
                                    }}
                                />
                                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                                <Line
                                    type="monotone"
                                    dataKey={(m) => {
                                        const income = m['cat_soldo'] || 0;
                                        const expense = (m['cat_nubank'] || 0) + (m['cat_claro'] || 0) + (m['cat_aluguel'] || 0) + (m['cat_tay'] || 0) + (m['cat_faculdade'] || 0) + (m['cat_imprevistos'] || 0);
                                        return income - expense;
                                    }}
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: 'white' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Composição Gastos Bar Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 font-sans">
                        Composição dos Gastos Fixos
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                <Bar dataKey="cat_nubank" name="Nubank CD" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="cat_claro" name="Claro + Dog" stackId="a" fill="#38bdf8" />
                                <Bar dataKey="cat_aluguel" name="Aluguel + Internet" stackId="a" fill="#f43f5e" />
                                <Bar dataKey="cat_tay" name="Tay" stackId="a" fill="#fb923c" />
                                <Bar dataKey="cat_faculdade" name="Faculdade" stackId="a" fill="#10b981" />
                                <Bar dataKey="cat_imprevistos" name="Imprevistos" stackId="a" fill="#facc15" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
