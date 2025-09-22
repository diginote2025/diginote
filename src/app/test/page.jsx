"use client"

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelFilter() {
  const [filteredData, setFilteredData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Website missing वाली companies फ़िल्टर करें
      const filtered = sheet
        .filter((row) => !row["yYlJEf href"])
        .map((row) => ({
          Company: row["OSrXXb"],
          Mobile: row["rllt__details 3"],
        }));

      setFilteredData(filtered);

      // Excel डाउनलोड
      const newSheet = XLSX.utils.json_to_sheet(filtered);
      const newBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newBook, newSheet, "No_Website");
      XLSX.writeFile(newBook, "companies_without_website.xlsx");

      // CSV डाउनलोड
      const csv = XLSX.utils.sheet_to_csv(newSheet);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "companies_without_website.csv";
      a.click();
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Excel Filter (No Website)</h1>
      <input type="file" accept=".xlsb,.xlsx,.xls" onChange={handleFileUpload} />

      {filteredData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Filtered Companies:</h2>
          <ul className="list-disc pl-5">
            {filteredData.map((row, index) => (
              <li key={index}>
                {row.Company} — {row.Mobile}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
