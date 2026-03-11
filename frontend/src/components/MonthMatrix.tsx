import React, { useState } from 'react';
import type { MonthData } from '../App';
import { Plus, Trash2 } from 'lucide-react';

interface MonthMatrixProps {
    data: MonthData[];
    onUpdate: (data: MonthData) => void;
    onDelete: (month: string) => void;
}

export interface CategoryDef {
    id: string;
    key?: string; // used for fixed calculations like 'gasto_total' or 'resto'
    label: string;
    type: 'income' | 'expense' | 'summary';
    color: string;
    isFixed?: boolean;
}

const DEFAULT_CATEGORIES: CategoryDef[] = [
    { id: 'cat_soldo', label: 'Soldo', type: 'income', color: 'bg-green-50/50 hover:bg-green-50 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-slate-800 dark:text-slate-200' },
    { id: 'cat_nubank', label: 'Nubank CD', type: 'expense', color: 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200' },
    { id: 'cat_claro', label: 'Claro + Dog', type: 'expense', color: 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200' },
    { id: 'cat_aluguel', label: 'Aluguel + Internet', type: 'expense', color: 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200' },
    { id: 'cat_tay', label: 'Tay', type: 'expense', color: 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200' },
    { id: 'cat_faculdade', label: 'Faculdade', type: 'expense', color: 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200' },
    { id: 'cat_imprevistos', label: 'Imprevistos', type: 'expense', color: 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200' },
    { id: 'cat_total', key: 'gasto_total', label: 'Gasto Total', type: 'summary', color: 'bg-red-100/50 dark:bg-red-900/40 font-semibold text-slate-800 dark:text-slate-200', isFixed: true },
    { id: 'cat_resto', key: 'resto', label: 'RESTO', type: 'summary', color: 'bg-blue-50 dark:bg-blue-900/30 font-bold text-blue-800 dark:text-blue-300', isFixed: true },
];

const MonthMatrix: React.FC<MonthMatrixProps> = ({ data, onUpdate, onDelete }) => {
    const [newMonthName, setNewMonthName] = useState('');
    const [categories, setCategories] = useState<CategoryDef[]>(() => {
        const saved = localStorage.getItem('financeiro_categories');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing categories from local storage", e);
            }
        }
        return DEFAULT_CATEGORIES;
    });

    React.useEffect(() => {
        localStorage.setItem('financeiro_categories', JSON.stringify(categories));
    }, [categories]);

    const handleCellChange = (monthData: MonthData, categoryId: string, value: string) => {
        // allow typing floats gently
        const numValue = value === '' ? 0 : parseFloat(value);
        if (isNaN(numValue)) return;

        const newValues = { ...monthData.values, [categoryId]: numValue };

        onUpdate({
            ...monthData,
            values: newValues
        });
    };

    const addCategory = (type: 'income' | 'expense') => {
        const id = `cat_${Math.random().toString(36).substr(2, 9)}`;
        const newCat: CategoryDef = {
            id,
            label: type === 'income' ? 'Nova Entrada' : 'Novo Gasto',
            type,
            color: type === 'income'
                ? 'bg-green-50/50 hover:bg-green-50 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-slate-800 dark:text-slate-200'
                : 'bg-red-50/30 hover:bg-red-50/50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-slate-800 dark:text-slate-200'
        };

        // Insert before the fixed summary categories
        setCategories(prev => {
            const temp = [...prev];
            const insertIndex = temp.findIndex(c => c.isFixed);
            if (insertIndex !== -1) {
                temp.splice(insertIndex, 0, newCat);
                return temp;
            }
            return [...temp, newCat];
        });
    };

    const updateCategoryLabel = (id: string, newLabel: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, label: newLabel } : c));
    };

    const removeCategory = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const handleAddMonth = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMonthName.trim()) return;

        // Check if month already exists
        if (data.some(d => d.month === newMonthName)) {
            alert("Este mês já existe!");
            return;
        }

        onUpdate({
            month: newMonthName,
            values: {} // Provide an empty object for values
        });
        setNewMonthName('');
    };

    // Sort data chronologically if possible, or just keep insertion order for now.
    const sortedData = [...data]; // Assuming backend returns in a reasonable order or we just append.

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">

            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center transition-colors">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Planilha de Lançamentos</h2>
                <form onSubmit={handleAddMonth} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Ex: Jan-2024"
                        className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={newMonthName}
                        onChange={e => setNewMonthName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        <Plus size={16} /> Adicionar Mês
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 border-b border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold text-sm w-48 sticky left-0 z-10 transition-colors">
                                Categoria
                            </th>
                            {sortedData.map(col => (
                                <th key={col.month} className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 text-center min-w-[140px] group transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span>{col.month}</span>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(col.month)}
                                            className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remover mês"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </th>
                            ))}
                            {sortedData.length === 0 && (
                                <th className="p-3 border-b border-slate-200 bg-white text-slate-400 font-normal italic text-sm text-center">
                                    Nenhum mês adicionado...
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, catIndex) => (
                            <tr key={cat.id} className={`border-b border-slate-200 dark:border-slate-700 transition-colors ${cat.color}`}>
                                <td className="p-0 border-r border-slate-200 dark:border-slate-700 font-medium text-sm sticky left-0 z-10 bg-inherit whitespace-nowrap min-w-[200px]">
                                    <div className="flex items-center w-full h-full p-2 group">
                                        {cat.type === 'income' && <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 shrink-0"></span>}
                                        {cat.type === 'expense' && <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2 shrink-0"></span>}
                                        {cat.type === 'summary' && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 shrink-0"></span>}

                                        <input
                                            value={cat.label}
                                            onChange={(e) => updateCategoryLabel(cat.id, e.target.value)}
                                            readOnly={cat.isFixed}
                                            className={`w-full bg-transparent outline-none font-medium truncate 
                                                ${cat.isFixed ? 'text-slate-700 dark:text-slate-200 cursor-default' : 'text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-700 focus:ring-1 focus:ring-blue-500 rounded px-1'}`}
                                        />

                                        {!cat.isFixed && (
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(cat.id)}
                                                className="ml-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                title="Remover Categoria"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>

                                {sortedData.map(col => {
                                    const isReadOnly = cat.isFixed;
                                    const val = col.values ? (col.values[cat.id] || 0) : 0;

                                    // Calculate dynamic derived values if it is a fixed row
                                    let displayVal = val;
                                    if (cat.key === 'gasto_total') {
                                        displayVal = categories.filter(c => c.type === 'expense' && !c.isFixed).reduce((acc, c) => acc + (col.values?.[c.id] || 0), 0);
                                    } else if (cat.key === 'resto') {
                                        const totalIncome = categories.filter(c => c.type === 'income' && !c.isFixed).reduce((acc, c) => acc + (col.values?.[c.id] || 0), 0);
                                        const totalExpense = categories.filter(c => c.type === 'expense' && !c.isFixed).reduce((acc, c) => acc + (col.values?.[c.id] || 0), 0);
                                        displayVal = totalIncome - totalExpense;
                                    }

                                    const isNegativeResto = cat.key === 'resto' && displayVal < 0;

                                    // Alert if resto < 10% of total income
                                    const totalIncomeForAlert = categories.filter(c => c.type === 'income' && !c.isFixed).reduce((acc, c) => acc + (col.values?.[c.id] || 0), 0);
                                    const isWarningResto = cat.key === 'resto' && displayVal > 0 && displayVal < (totalIncomeForAlert * 0.1);

                                    return (
                                        <td key={`${col.month}-${cat.id}`} className="p-0 relative">
                                            <input
                                                type="number"
                                                readOnly={isReadOnly}
                                                value={displayVal === 0 && !isReadOnly ? '' : displayVal} // Show empty if 0 for better UX, unless readOnly
                                                placeholder="0"
                                                onChange={(e) => handleCellChange(col, cat.id, e.target.value)}
                                                className={`w-full h-full p-3 text-right text-sm bg-transparent outline-none transition-colors
                                            ${isReadOnly ? 'cursor-not-allowed text-slate-600 dark:text-slate-400' : 'focus:bg-white dark:focus:bg-slate-700/50 focus:ring-inset focus:ring-2 focus:ring-blue-500'}
                                            ${isNegativeResto ? 'text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/30' : ''}
                                            ${isWarningResto ? 'text-yellow-600 dark:text-yellow-400 font-bold bg-yellow-50 dark:bg-yellow-900/30' : ''}
                                        `}
                                            />
                                        </td>
                                    );
                                })}
                                {sortedData.length === 0 && (
                                    <td className="p-3 text-center text-slate-300">-</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                    <button
                        type="button"
                        onClick={() => addCategory('income')}
                        className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 flex items-center gap-1"
                    >
                        <Plus size={16} /> Adicionar Nova Entrada
                    </button>
                    <button
                        type="button"
                        onClick={() => addCategory('expense')}
                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1"
                    >
                        <Plus size={16} /> Adicionar Novo Gasto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonthMatrix;
