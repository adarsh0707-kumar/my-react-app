import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/apiCall.js";
import Loading from "../components/Loading.jsx";
import Title from "../components/Title";
import Input from "../components/ui/input.jsx";
import Button from "../components/ui/button.jsx";
import { MdAddCircle, MdSearch } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import { exportExcel, exportCSV, exportPDF } from "../libs/exportFile.js";
import DateRange from "../components/DateRange.jsx";
import { formatCurrency } from "../libs/index.js";
import { TiWarning } from "react-icons/ti";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiProgress3Line } from "react-icons/ri";
import ViewTransition from "../components/view-transition.jsx";
import AddTransaction from "../components/AddTransaction.jsx";

const Transaction = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const startData = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";
  const fileName = `Transactions ${startData} – ${endDate}`;

  const fetchTransactions = async () => {
    try {
      const URL = `/transactions?df=${startData}&dt=${endDate}&s=${search}`;
      const { data: res } = await api.get(URL);
      console.log("API response res:", res);
      setData(res?.data?.transactions || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Something unexpected happened."
      );
      if (err?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTransaction = (item) => {
    setSelected(item);
    setIsOpenView(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({ df: startData, dt: endDate });
    setIsLoading(true);
    await fetchTransactions();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [startData, endDate]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleExport = (type) => {
    if (!Array.isArray(data) || data.length === 0) {
      toast.error("No data to export");
      return;
    }
    setIsExportOpen(false);
    if (type === "excel") exportExcel(data, fileName);
    if (type === "csv") exportCSV(data, fileName);
    if (type === "pdf") exportPDF(data, fileName);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="w-full py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <Title title="Transactions Activity" />
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <DateRange />

            <form onSubmit={handleSearch}>
              <div className="w-full flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
                <MdSearch className="text-xl text-gray-600 dark:text-gray-600" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search now..."
                  className="outline-none group bg-transparent text-gray-700 dark:text-gray-400 placeholder:text-gray-600"
                />
              </div>
            </form>

            <Button
              onClick={() => setIsOpen(true)}
              className="py-1.5 px-2 rounded text-white bg-black dark:bg-violet-800 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-black/15 dark:hover:bg-violet-600"
            >
              <MdAddCircle size={22} />
              <span>Pay</span>
            </Button>

            {/* Export dropdown */}
            <div className="relative inline-block text-left" ref={exportRef}>
              <Button
                onClick={() => setIsExportOpen((o) => !o)}
                className="flex items-center gap-2 text-black dark:text-gray-300"
              >
                <CiExport size={24} /> Export
              </Button>

              {isExportOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-slate-300 dark:bg-gray-800 z-10 flex flex-col justify-center items-center space-y-2 py-4">
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-40 bg-green-400 text-center px-4 py-2 hover:bg-green-300 rounded"
                  >
                    Excel (.xlsx)
                  </button>

                  <button
                    onClick={() => handleExport("csv")}
                    className="w-40 bg-green-400 text-center px-4 py-2 hover:bg-green-300 rounded"
                  >
                    CSV (.csv)
                  </button>

                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-40 bg-green-400 text-center px-4 py-2 hover:bg-green-300 rounded"
                  >
                    PDF (.pdf)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          {data?.length === 0 ? (
            <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
              <span>No Transaction History</span>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="w-full border-b border-gray-700">
                  <tr className="w-full text-left text-black dark::text-gray-400">
                    <th className="py-2">Date</th>
                    <th className="px-2 py-2"> Description</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Source</th>
                    <th className="px-2 py-2">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      key={index}
                      className="text-sm text-gray-600 border-b border-gray-200 dark:border-gray-700 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="py-4">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-2 py-3">
                        <div className="flex flex-col">
                          <p className="text-base font-medium text-black 2xl:text-lg dark:text-gray-400 line-clamp-1">
                            {item?.description}
                          </p>
                        </div>
                      </td>

                      <td className="flex items-center gap-2 px-2 py-3">
                        {item?.status === "Pending" && (
                          <RiProgress3Line
                            className="text-amber-600"
                            size={24}
                          />
                        )}

                        {item?.status === "Completed" && (
                          <IoCheckmarkDoneCircle
                            className="text-emerald-600"
                            size={24}
                          />
                        )}

                        {item?.status === "Rejected" && (
                          <TiWarning className="text-red-600" size={24} />
                        )}

                        <span>{item?.status}</span>
                      </td>

                      <td className="px-2 py-3">
                        <p className="line-clamp-1">{item?.source}</p>
                      </td>

                      <td className="flex items-center px-2 py-4 font-medium text-black dark:text-gray-400">
                        <span
                          className={`${
                            item?.type === "income"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {item?.type === "income" ? "+" : "-"}
                        </span>

                        {formatCurrency(item?.amount)}
                      </td>

                      <td className="py-4 [x-2">
                        <Button
                          onClick={() => handleViewTransaction(item)}
                          className="outline-none text-violet-600 hover:underline"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </>
          )}
        </div>
      </div>

      <AddTransaction
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchTransactions}
        key={new Date().getTime()}
      />

      <ViewTransition
        data={selected}
        isOpen={isOpenView}
        setIsOpen={setIsOpenView}
      />

    </>
  );
};

export default Transaction;
