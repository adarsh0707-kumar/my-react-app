// src/libs/exportFile.js
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import exportFromJSON from 'export-from-json'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Excel export
export function exportExcel (data, fileName) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
}

// CSV export
export function exportCSV (data, fileName) {
  exportFromJSON({ data, fileName, exportType: exportFromJSON.types.csv })
}

// PDF export
export function exportPDF (data, fileName) {
  const doc = new jsPDF()
  const columns = Object.keys(data[0] || {}).map(k => ({ header: k, dataKey: k }))
  autoTable(doc, { columns, body: data })
  doc.save(`${fileName}.pdf`)
}

