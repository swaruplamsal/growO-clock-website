"use client";
import { useState, useEffect } from "react";
import { investmentsAPI } from "@/lib/api";

export default function InvestmentsPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    portfolio_type: "GROWTH",
    risk_level: "MODERATE",
  });
  const [holdingForm, setHoldingForm] = useState({
    symbol: "",
    name: "",
    quantity: "",
    purchase_price: "",
    current_price: "",
    asset_type: "STOCK",
  });

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };
  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors";
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);

  const fetchPortfolios = async () => {
    try {
      const { data } = await investmentsAPI.listPortfolios();
      setPortfolios(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchDetails = async (id) => {
    setDetailsLoading(true);
    try {
      const [h, p] = await Promise.allSettled([
        investmentsAPI.listHoldings(id),
        investmentsAPI.getPerformance(id),
      ]);
      setHoldings(
        h.status === "fulfilled"
          ? Array.isArray(h.value.data)
            ? h.value.data
            : (h.value.data.results ?? [])
          : [],
      );
      setPerformance(p.status === "fulfilled" ? p.value.data : null);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await investmentsAPI.createPortfolio(form);
      flash("success", "Portfolio created!");
      setShowForm(false);
      setForm({
        name: "",
        description: "",
        portfolio_type: "GROWTH",
        risk_level: "MODERATE",
      });
      fetchPortfolios();
    } catch (err) {
      flash(
        "error",
        err.response?.data?.detail ||
          Object.values(err.response?.data || {})?.[0]?.[0] ||
          "Failed to create portfolio.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this portfolio?")) return;
    try {
      await investmentsAPI.deletePortfolio(id);
      flash("success", "Portfolio deleted.");
      setSelected(null);
      fetchPortfolios();
    } catch {
      flash("error", "Failed to delete.");
    }
  };

  const handleSelect = (portfolio) => {
    if (selected?.id === portfolio.id) {
      setSelected(null);
      return;
    }
    setSelected(portfolio);
    fetchDetails(portfolio.id);
  };

  const addHolding = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await investmentsAPI.createHolding(selected.id, {
        ...holdingForm,
        quantity: parseFloat(holdingForm.quantity),
        purchase_price: parseFloat(holdingForm.purchase_price),
        current_price:
          parseFloat(holdingForm.current_price) ||
          parseFloat(holdingForm.purchase_price),
      });
      setHoldingForm({
        symbol: "",
        name: "",
        quantity: "",
        purchase_price: "",
        current_price: "",
        asset_type: "STOCK",
      });
      fetchDetails(selected.id);
      flash("success", "Holding added!");
    } catch (err) {
      flash("error", err.response?.data?.detail || "Failed to add holding.");
    } finally {
      setSaving(false);
    }
  };

  const deleteHolding = async (holdingId) => {
    try {
      await investmentsAPI.deleteHolding(selected.id, holdingId);
      fetchDetails(selected.id);
      flash("success", "Holding removed.");
    } catch {
      flash("error", "Failed to remove.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-merriweather text-2xl font-bold text-gray-900">
          Investment Portfolios
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelected(null);
          }}
          className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Portfolio
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg font-montserrat text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {/* Create */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-merriweather text-lg font-bold text-gray-900 mb-4">
            Create Portfolio
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Growth Portfolio"
              />
            </div>
            <div>
              <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className={inputClass}
                  value={form.portfolio_type}
                  onChange={(e) =>
                    setForm({ ...form, portfolio_type: e.target.value })
                  }
                >
                  <option value="GROWTH">Growth</option>
                  <option value="INCOME">Income</option>
                  <option value="BALANCED">Balanced</option>
                  <option value="CONSERVATIVE">Conservative</option>
                </select>
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Risk Level
                </label>
                <select
                  className={inputClass}
                  value={form.risk_level}
                  onChange={(e) =>
                    setForm({ ...form, risk_level: e.target.value })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="HIGH">High</option>
                  <option value="AGGRESSIVE">Aggressive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Portfolio"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {portfolios.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <p className="font-montserrat text-gray-500">
            No portfolios yet. Create one to start tracking investments.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {portfolios.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-xl border transition-all ${selected?.id === p.id ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-200"}`}
            >
              <div
                onClick={() => handleSelect(p)}
                className="px-6 py-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-montserrat text-sm font-semibold text-gray-900 truncate">
                      {p.name}
                    </p>
                    <span className="font-montserrat text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                      {p.portfolio_type_display || p.portfolio_type}
                    </span>
                    <span className="font-montserrat text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                      {p.risk_level_display || p.risk_level} Risk
                    </span>
                  </div>
                  {p.total_value && (
                    <p className="font-montserrat text-xs text-gray-500">
                      Total Value: {fmt(p.total_value)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <svg
                    className={`w-5 h-5 text-gray-300 transition-transform ${selected?.id === p.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {selected?.id === p.id && (
                <div className="border-t border-gray-50 px-6 pb-6 pt-4">
                  {p.description && (
                    <p className="font-montserrat text-sm text-gray-600 mb-4">
                      {p.description}
                    </p>
                  )}

                  {detailsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      {/* Performance Summary */}
                      {performance && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                          {[
                            {
                              label: "Total Value",
                              val: fmt(performance.total_value),
                            },
                            {
                              label: "Total Cost",
                              val: fmt(performance.total_cost),
                            },
                            {
                              label: "Gain/Loss",
                              val: fmt(performance.total_gain),
                              color:
                                (performance.total_gain || 0) >= 0
                                  ? "text-emerald-600"
                                  : "text-red-600",
                            },
                            {
                              label: "Return",
                              val: `${(performance.total_return || 0).toFixed(2)}%`,
                              color:
                                (performance.total_return || 0) >= 0
                                  ? "text-emerald-600"
                                  : "text-red-600",
                            },
                          ].map((s) => (
                            <div
                              key={s.label}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <p className="font-montserrat text-xs text-gray-500">
                                {s.label}
                              </p>
                              <p
                                className={`font-montserrat text-sm font-bold ${s.color || "text-gray-900"}`}
                              >
                                {s.val}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Holdings */}
                      <h3 className="font-merriweather text-sm font-bold text-gray-900 mb-3">
                        Holdings ({holdings.length})
                      </h3>
                      {holdings.length > 0 && (
                        <div className="overflow-x-auto mb-4">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-100">
                                {[
                                  "Symbol",
                                  "Name",
                                  "Qty",
                                  "Buy Price",
                                  "Current",
                                  "Value",
                                  "Gain/Loss",
                                  "",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="font-montserrat text-xs font-medium text-gray-500 py-2 px-2"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {holdings.map((h) => {
                                const gain =
                                  (h.current_price - h.purchase_price) *
                                  h.quantity;
                                return (
                                  <tr
                                    key={h.id}
                                    className="border-b border-gray-50"
                                  >
                                    <td className="py-2 px-2 font-montserrat text-sm font-semibold text-gray-900">
                                      {h.symbol}
                                    </td>
                                    <td className="py-2 px-2 font-montserrat text-sm text-gray-600">
                                      {h.name}
                                    </td>
                                    <td className="py-2 px-2 font-montserrat text-sm">
                                      {h.quantity}
                                    </td>
                                    <td className="py-2 px-2 font-montserrat text-sm">
                                      {fmt(h.purchase_price)}
                                    </td>
                                    <td className="py-2 px-2 font-montserrat text-sm">
                                      {fmt(h.current_price)}
                                    </td>
                                    <td className="py-2 px-2 font-montserrat text-sm font-medium">
                                      {fmt(h.current_price * h.quantity)}
                                    </td>
                                    <td
                                      className={`py-2 px-2 font-montserrat text-sm font-medium ${gain >= 0 ? "text-emerald-600" : "text-red-600"}`}
                                    >
                                      {gain >= 0 ? "+" : ""}
                                      {fmt(gain)}
                                    </td>
                                    <td className="py-2 px-2">
                                      <button
                                        onClick={() => deleteHolding(h.id)}
                                        className="text-gray-400 hover:text-red-500"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Add Holding */}
                      <form
                        onSubmit={addHolding}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <p className="font-montserrat text-xs font-medium text-gray-600 mb-3">
                          Add Holding
                        </p>
                        <div className="flex flex-wrap gap-2 items-end">
                          <input
                            className={`${inputClass} w-24`}
                            placeholder="Symbol"
                            required
                            value={holdingForm.symbol}
                            onChange={(e) =>
                              setHoldingForm({
                                ...holdingForm,
                                symbol: e.target.value.toUpperCase(),
                              })
                            }
                          />
                          <input
                            className={`${inputClass} flex-1 min-w-[100px]`}
                            placeholder="Name"
                            required
                            value={holdingForm.name}
                            onChange={(e) =>
                              setHoldingForm({
                                ...holdingForm,
                                name: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            step="0.01"
                            className={`${inputClass} w-20`}
                            placeholder="Qty"
                            required
                            value={holdingForm.quantity}
                            onChange={(e) =>
                              setHoldingForm({
                                ...holdingForm,
                                quantity: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            step="0.01"
                            className={`${inputClass} w-28`}
                            placeholder="Buy $"
                            required
                            value={holdingForm.purchase_price}
                            onChange={(e) =>
                              setHoldingForm({
                                ...holdingForm,
                                purchase_price: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            step="0.01"
                            className={`${inputClass} w-28`}
                            placeholder="Current $"
                            value={holdingForm.current_price}
                            onChange={(e) =>
                              setHoldingForm({
                                ...holdingForm,
                                current_price: e.target.value,
                              })
                            }
                          />
                          <select
                            className={`${inputClass} w-28`}
                            value={holdingForm.asset_type}
                            onChange={(e) =>
                              setHoldingForm({
                                ...holdingForm,
                                asset_type: e.target.value,
                              })
                            }
                          >
                            <option value="STOCK">Stock</option>
                            <option value="ETF">ETF</option>
                            <option value="BOND">Bond</option>
                            <option value="CRYPTO">Crypto</option>
                            <option value="MUTUAL_FUND">Mutual Fund</option>
                            <option value="OTHER">Other</option>
                          </select>
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-xs font-medium hover:bg-primary-dark disabled:opacity-50"
                          >
                            {saving ? "Adding..." : "Add"}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
