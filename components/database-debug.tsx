"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function DatabaseDebug() {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableData, setTableData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available tables
  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true)

        // This query gets all tables in the public schema
        const { data, error } = await supabase.rpc("get_tables").select("*")

        if (error) throw error

        if (data) {
          // If RPC doesn't work, we'll use a hardcoded list of tables from the schema
          const tableList = data.map((t: any) => t.table_name) || [
            "user_order",
            "user",
            "game",
            "partner",
            "feathery_form",
            "game_donation",
            "template",
            "team",
            "team_event",
          ]
          setTables(tableList)
        }
      } catch (err) {
        console.error("Error fetching tables:", err)
        // Fallback to hardcoded list
        setTables([
          "user_order",
          "user",
          "game",
          "partner",
          "feathery_form",
          "game_donation",
          "template",
          "team",
          "team_event",
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])

  // Fetch data from selected table
  const fetchTableData = async (tableName: string) => {
    if (!tableName) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from(tableName).select("*").limit(10)

      if (error) throw error

      setTableData(data || [])
    } catch (err: any) {
      console.error(`Error fetching data from ${tableName}:`, err)
      setError(err.message || "An error occurred")
      setTableData([])
    } finally {
      setLoading(false)
    }
  }

  // Handle table selection
  const handleTableSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const table = e.target.value
    setSelectedTable(table)
    fetchTableData(table)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Database Debug</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Table:</label>
        <select
          value={selectedTable}
          onChange={handleTableSelect}
          className="w-full p-2 border rounded"
          disabled={loading || tables.length === 0}
        >
          <option value="">Select a table...</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {selectedTable && tableData.length === 0 && !loading && !error && (
        <p className="text-yellow-500">No data found in {selectedTable}</p>
      )}

      {tableData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Data from {selectedTable} ({tableData.length} rows)
          </h3>
          <div className="overflow-x-auto">
            <pre className="bg-gray-100 p-3 rounded text-xs">{JSON.stringify(tableData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
