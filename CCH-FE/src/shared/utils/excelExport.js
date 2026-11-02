/**
 * Utility for exporting data to Microsoft Excel (.xls XML Spreadsheet 2003) and CSV.
 * Pure browser-based implementation without heavy third-party dependencies,
 * ensuring high performance, zero security scanner risk, and proper UTF-8 formatting.
 */

function escapeXml(value) {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function escapeCsvField(value) {
  if (value === null || value === undefined) return '""'
  const stringValue = String(value)
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return `"${stringValue}"`
}

function triggerDownload(blob, fullFilename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fullFilename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export data to XML Spreadsheet 2003 (.xls compatible with MS Excel, WPS, LibreOffice)
 *
 * @param {Object} options
 * @param {string} options.filename - Base filename without extension
 * @param {string} [options.sheetName='Laporan'] - Excel sheet name
 * @param {Array<{ header: string, key: string, transform?: (val: any, row: any) => any }>} options.columns - Column definitions
 * @param {Array<Object>} options.data - Data rows
 */
export function exportToExcel({ filename = 'laporan', sheetName = 'Laporan', columns = [], data = [] }) {
  const safeSheetName = escapeXml(sheetName.slice(0, 31))

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#EE2737" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataStyle">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="9" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="DataCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="9" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="DataOverdue">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECDD3"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECDD3"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECDD3"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECDD3"/>
   </Borders>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="9" ss:Color="#BE123C" ss:Bold="1"/>
   <Interior ss:Color="#FFE4E6" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${safeSheetName}">
  <Table ss:DefaultRowHeight="20">`

  // Define Column Widths
  columns.forEach(() => {
    xml += `\n   <Column ss:AutoFitWidth="1" ss:Width="120"/>`
  })

  // Header Row
  xml += `\n   <Row ss:Height="24">`
  columns.forEach((col) => {
    xml += `\n    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${escapeXml(col.header)}</Data></Cell>`
  })
  xml += `\n   </Row>`

  // Data Rows
  data.forEach((row, rowIndex) => {
    const isOverdue = row.is_overdue || (row.duration_seconds && row.duration_seconds >= 345600)
    const styleId = isOverdue ? 'DataOverdue' : 'DataStyle'

    xml += `\n   <Row ss:Height="20">`
    columns.forEach((col) => {
      let rawVal = row[col.key]
      if (col.transform) {
        rawVal = col.transform(rawVal, row, rowIndex)
      } else if (col.key === 'no') {
        rawVal = rowIndex + 1
      }

      const valStr = rawVal === null || rawVal === undefined ? '' : String(rawVal)
      const isNum = typeof rawVal === 'number' && !Number.isNaN(rawVal)

      xml += `\n    <Cell ss:StyleID="${styleId}"><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXml(valStr)}</Data></Cell>`
    })
    xml += `\n   </Row>`
  })

  xml += `\n  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  triggerDownload(blob, `${filename}.xls`)
}

/**
 * Export data to CSV format with UTF-8 BOM
 *
 * @param {Object} options
 * @param {string} options.filename - Base filename without extension
 * @param {Array<{ header: string, key: string, transform?: (val: any, row: any) => any }>} options.columns - Column definitions
 * @param {Array<Object>} options.data - Data rows
 */
export function exportToCsv({ filename = 'laporan', columns = [], data = [] }) {
  const headerLine = columns.map((col) => escapeCsvField(col.header)).join(',')

  const dataLines = data.map((row, rowIndex) => {
    return columns
      .map((col) => {
        let rawVal = row[col.key]
        if (col.transform) {
          rawVal = col.transform(rawVal, row, rowIndex)
        } else if (col.key === 'no') {
          rawVal = rowIndex + 1
        }
        return escapeCsvField(rawVal)
      })
      .join(',')
  })

  // UTF-8 BOM (\uFEFF) ensures Excel opens Indonesian characters without encoding problems
  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${filename}.csv`)
}
