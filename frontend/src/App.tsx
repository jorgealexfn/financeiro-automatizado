import { useEffect, useState } from 'react'
import axios from 'axios'
import MonthMatrix from './components/MonthMatrix'
import Dashboard from './components/Dashboard'
import { LayoutDashboard, Table } from 'lucide-react'

// Centralized types
export interface MonthData {
  id?: number
  month: string
  values: Record<string, number>
}

const API_URL = 'http://localhost:8000/api/months'

function App() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'dashboard'>('matrix')
  const [data, setData] = useState<MonthData[]>([])
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  // Apply dark class to body/html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL)
      setData(response.data)
    } catch (error) {
      console.error("Error fetching data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateMonth = async (monthData: MonthData) => {
    try {
      const response = await axios.post(API_URL, monthData)
      setData(prev => {
        const index = prev.findIndex(m => m.month === response.data.month)
        if (index >= 0) {
          const newData = [...prev]
          newData[index] = response.data
          return newData
        } else {
          return [...prev, response.data]
        }
      })
    } catch (error) {
      console.error("Error updating data", error)
    }
  }

  const handleDeleteMonth = async (month: string) => {
    try {
      await axios.delete(`${API_URL}/${month}`)
      setData(prev => prev.filter(m => m.month !== month))
    } catch (error) {
      console.error("Error deleting month", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-200 transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg">
                <LayoutDashboard size={20} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Finanças Automáticas
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all"
                title="Alternar Tema"
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Tabs */}
              <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg transition-colors">
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${activeTab === 'matrix'
                    ? 'bg-white dark:bg-slate-800 shadow-sm font-medium text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                >
                  <Table size={16} />
                  Planilha
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${activeTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-800 shadow-sm font-medium text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                >
                  <LayoutDashboard size={16} />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'matrix' ? (
              <MonthMatrix
                data={data}
                onUpdate={handleUpdateMonth}
                onDelete={handleDeleteMonth}
              />
            ) : (
              <Dashboard data={data} />
            )}
          </div>
        )}
      </main>

    </div>
  )
}

export default App
