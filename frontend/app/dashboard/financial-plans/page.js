"use client";
import { useState, useEffect } from "react";
import { plansAPI } from "@/lib/api";

export default function FinancialPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "DRAFT",
  });
  const [details, setDetails] = useState({
    goals: [],
    incomes: [],
    expenses: [],
    assets: [],
    liabilities: [],
  });
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Sub-item forms
  const [goalForm, setGoalForm] = useState({
    name: "",
    category: "RETIREMENT",
    target_amount: "",
    current_amount: "",
    target_date: "",
    priority: "MEDIUM",
  });
  const [incomeForm, setIncomeForm] = useState({
    source: "",
    amount: "",
    frequency: "MONTHLY",
  });
  const [expenseForm, setExpenseForm] = useState({
    category: "",
    description: "",
    amount: "",
    frequency: "MONTHLY",
  });
  const [assetForm, setAssetForm] = useState({
    asset_type: "SAVINGS",
    description: "",
    value: "",
    acquisition_date: "",
  });
  const [liabilityForm, setLiabilityForm] = useState({
    liability_type: "LOAN",
    description: "",
    amount: "",
    interest_rate: "",
    monthly_payment: "",
    payoff_date: "",
  });
  const [activeSubTab, setActiveSubTab] = useState("goals");

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };
  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors";

  const fetchPlans = async () => {
    try {
      const { data } = await plansAPI.list();
      setPlans(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchDetails = async (planId) => {
    setDetailsLoading(true);
    try {
      const [g, i, e, a, l] = await Promise.allSettled([
        plansAPI.listGoals(planId),
        plansAPI.listIncomes(planId),
        plansAPI.listExpenses(planId),
        plansAPI.listAssets(planId),
        plansAPI.listLiabilities(planId),
      ]);
      setDetails({
        goals:
          g.status === "fulfilled"
            ? Array.isArray(g.value.data)
              ? g.value.data
              : (g.value.data.results ?? [])
            : [],
        incomes:
          i.status === "fulfilled"
            ? Array.isArray(i.value.data)
              ? i.value.data
              : (i.value.data.results ?? [])
            : [],
        expenses:
          e.status === "fulfilled"
            ? Array.isArray(e.value.data)
              ? e.value.data
              : (e.value.data.results ?? [])
            : [],
        assets:
          a.status === "fulfilled"
            ? Array.isArray(a.value.data)
              ? a.value.data
              : (a.value.data.results ?? [])
            : [],
        liabilities:
          l.status === "fulfilled"
            ? Array.isArray(l.value.data)
              ? l.value.data
              : (l.value.data.results ?? [])
            : [],
      });
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
      await plansAPI.create({
        title: form.title,
        description: form.description,
        status: form.status,
      });
      flash("success", "Financial plan created!");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        status: "DRAFT",
      });
      fetchPlans();
    } catch (err) {
      flash(
        "error",
        err.response?.data?.detail ||
          Object.values(err.response?.data || {})?.[0]?.[0] ||
          "Failed to create plan.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this financial plan?")) return;
    try {
      await plansAPI.delete(id);
      flash("success", "Plan deleted.");
      setSelected(null);
      fetchPlans();
    } catch {
      flash("error", "Failed to delete.");
    }
  };

  const handleSelect = async (plan) => {
    if (selected?.id === plan.id) {
      setSelected(null);
      return;
    }
    setSelected(plan);
    setActiveSubTab("goals");
    fetchDetails(plan.id);
  };

  // Sub-item handlers
  const addGoal = async (e) => {
    e.preventDefault();
    try {
      await plansAPI.createGoal(selected.id, {
        name: goalForm.name,
        category: goalForm.category,
        target_amount: parseFloat(goalForm.target_amount),
        current_amount: parseFloat(goalForm.current_amount) || 0,
        target_date: goalForm.target_date,
        priority: goalForm.priority,
      });
      setGoalForm({
        name: "",
        category: "RETIREMENT",
        target_amount: "",
        current_amount: "",
        target_date: "",
        priority: "MEDIUM",
      });
      fetchDetails(selected.id);
      flash("success", "Goal added!");
    } catch (err) {
      flash("error", "Failed to add goal.");
    }
  };

  const addIncome = async (e) => {
    e.preventDefault();
    try {
      await plansAPI.createIncome(selected.id, {
        ...incomeForm,
        amount: parseFloat(incomeForm.amount),
      });
      setIncomeForm({ source: "", amount: "", frequency: "MONTHLY" });
      fetchDetails(selected.id);
      flash("success", "Income added!");
    } catch (err) {
      flash("error", "Failed to add income.");
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      await plansAPI.createExpense(selected.id, {
        category: expenseForm.category,
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        frequency: expenseForm.frequency,
      });
      setExpenseForm({
        category: "",
        description: "",
        amount: "",
        frequency: "MONTHLY",
      });
      fetchDetails(selected.id);
      flash("success", "Expense added!");
    } catch (err) {
      flash("error", "Failed to add expense.");
    }
  };

  const addAsset = async (e) => {
    e.preventDefault();
    try {
      await plansAPI.createAsset(selected.id, {
        asset_type: assetForm.asset_type,
        description: assetForm.description,
        value: parseFloat(assetForm.value),
        acquisition_date: assetForm.acquisition_date,
      });
      setAssetForm({
        asset_type: "SAVINGS",
        description: "",
        value: "",
        acquisition_date: "",
      });
      fetchDetails(selected.id);
      flash("success", "Asset added!");
    } catch (err) {
      flash("error", "Failed to add asset.");
    }
  };

  const addLiability = async (e) => {
    e.preventDefault();
    try {
      await plansAPI.createLiability(selected.id, {
        liability_type: liabilityForm.liability_type,
        description: liabilityForm.description,
        amount: parseFloat(liabilityForm.amount),
        interest_rate: parseFloat(liabilityForm.interest_rate) || 0,
        monthly_payment:
          liabilityForm.monthly_payment !== ""
            ? parseFloat(liabilityForm.monthly_payment)
            : null,
        payoff_date: liabilityForm.payoff_date || null,
      });
      setLiabilityForm({
        liability_type: "LOAN",
        description: "",
        amount: "",
        interest_rate: "",
        monthly_payment: "",
        payoff_date: "",
      });
      fetchDetails(selected.id);
      flash("success", "Liability added!");
    } catch (err) {
      flash("error", "Failed to add liability.");
    }
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);

  const subTabs = [
    { key: "goals", label: "Goals", count: details.goals.length },
    { key: "incomes", label: "Income", count: details.incomes.length },
    { key: "expenses", label: "Expenses", count: details.expenses.length },
    { key: "assets", label: "Assets", count: details.assets.length },
    {
      key: "liabilities",
      label: "Liabilities",
      count: details.liabilities.length,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-merriweather text-2xl lg:text-3xl font-bold text-gray-900">
            Financial Plans
          </h1>
          <p className="font-montserrat text-sm text-gray-500 mt-1">
            Create and manage comprehensive financial plans
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelected(null);
          }}
          className="bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
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
          New Plan
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg font-montserrat text-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success" ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200" : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="font-merriweather text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
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
            </div>
            Create Financial Plan
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                Plan Title *
              </label>
              <input
                className={inputClass}
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Retirement Plan 2025"
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
                  Status
                </label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Creating..." : "Create Plan"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plan List */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="font-montserrat font-semibold text-gray-700">
            No financial plans yet. Create your first plan to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border transition-all duration-200 ${selected?.id === plan.id ? "border-primary shadow-lg scale-[1.01]" : "border-gray-100 hover:border-gray-200 hover:shadow-md"}`}
            >
              <div
                onClick={() => handleSelect(plan)}
                className="px-6 py-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-montserrat text-sm font-semibold text-gray-900 truncate">
                      {plan.title}
                    </p>
                    <span className="font-montserrat text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                      {plan.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-montserrat text-xs text-gray-500">
                    <span>
                      Created: {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(plan.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
                    className={`w-5 h-5 text-gray-300 transition-transform ${selected?.id === plan.id ? "rotate-180" : ""}`}
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

              {/* Expanded Details */}
              {selected?.id === plan.id && (
                <div className="border-t border-gray-50 px-6 pb-6 pt-4">
                  {plan.description && (
                    <p className="font-montserrat text-sm text-gray-600 mb-4">
                      {plan.description}
                    </p>
                  )}

                  {/* Sub-tabs */}
                  <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                    {subTabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setActiveSubTab(t.key)}
                        className={`px-3 py-1.5 rounded-lg font-montserrat text-xs font-medium whitespace-nowrap transition-colors ${activeSubTab === t.key ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        {t.label} ({t.count})
                      </button>
                    ))}
                  </div>

                  {detailsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      {/* Goals */}
                      {activeSubTab === "goals" && (
                        <div className="space-y-3">
                          {details.goals.map((g, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-montserrat text-sm font-medium text-gray-900">
                                  {g.name}
                                </p>
                                <p className="font-montserrat text-xs text-gray-500">
                                  {g.category} • {fmt(g.target_amount)}{" "}
                                  {g.target_date &&
                                    `by ${new Date(g.target_date).toLocaleDateString()}`}
                                </p>
                              </div>
                              <span
                                className={`font-montserrat text-xs px-2 py-0.5 rounded-full ${g.priority === "HIGH" ? "bg-red-100 text-red-700" : g.priority === "LOW" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700"}`}
                              >
                                {g.priority}
                              </span>
                            </div>
                          ))}
                          <form
                            onSubmit={addGoal}
                            className="flex flex-wrap gap-2 items-end pt-2"
                          >
                            <input
                              className={`${inputClass} flex-1 min-w-[120px]`}
                              placeholder="Goal name"
                              required
                              value={goalForm.name}
                              onChange={(e) =>
                                setGoalForm({
                                  ...goalForm,
                                  name: e.target.value,
                                })
                              }
                            />
                            <select
                              className={`${inputClass} w-36`}
                              value={goalForm.category}
                              onChange={(e) =>
                                setGoalForm({
                                  ...goalForm,
                                  category: e.target.value,
                                })
                              }
                            >
                              <option value="RETIREMENT">Retirement</option>
                              <option value="EDUCATION">Education</option>
                              <option value="HOME">Home</option>
                              <option value="EMERGENCY">Emergency</option>
                              <option value="TRAVEL">Travel</option>
                              <option value="BUSINESS">Business</option>
                              <option value="OTHER">Other</option>
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Amount"
                              required
                              value={goalForm.target_amount}
                              onChange={(e) =>
                                setGoalForm({
                                  ...goalForm,
                                  target_amount: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Current"
                              value={goalForm.current_amount}
                              onChange={(e) =>
                                setGoalForm({
                                  ...goalForm,
                                  current_amount: e.target.value,
                                })
                              }
                            />
                            <input
                              type="date"
                              className={`${inputClass} w-36`}
                              required
                              value={goalForm.target_date}
                              onChange={(e) =>
                                setGoalForm({
                                  ...goalForm,
                                  target_date: e.target.value,
                                })
                              }
                            />
                            <select
                              className={`${inputClass} w-28`}
                              value={goalForm.priority}
                              onChange={(e) =>
                                setGoalForm({
                                  ...goalForm,
                                  priority: e.target.value,
                                })
                              }
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                            </select>
                            <button
                              type="submit"
                              className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-xs font-medium hover:bg-primary-dark"
                            >
                              Add
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Income */}
                      {activeSubTab === "incomes" && (
                        <div className="space-y-3">
                          {details.incomes.map((item, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                            >
                              <p className="font-montserrat text-sm font-medium text-gray-900">
                                {item.source}
                              </p>
                              <p className="font-montserrat text-sm text-emerald-600 font-semibold">
                                {fmt(item.amount)} /{" "}
                                {item.frequency?.toLowerCase()}
                              </p>
                            </div>
                          ))}
                          <form
                            onSubmit={addIncome}
                            className="flex flex-wrap gap-2 items-end pt-2"
                          >
                            <input
                              className={`${inputClass} flex-1 min-w-[120px]`}
                              placeholder="Source"
                              required
                              value={incomeForm.source}
                              onChange={(e) =>
                                setIncomeForm({
                                  ...incomeForm,
                                  source: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Amount"
                              required
                              value={incomeForm.amount}
                              onChange={(e) =>
                                setIncomeForm({
                                  ...incomeForm,
                                  amount: e.target.value,
                                })
                              }
                            />
                            <select
                              className={`${inputClass} w-32`}
                              value={incomeForm.frequency}
                              onChange={(e) =>
                                setIncomeForm({
                                  ...incomeForm,
                                  frequency: e.target.value,
                                })
                              }
                            >
                              <option value="MONTHLY">Monthly</option>
                              <option value="ANNUAL">Annual</option>
                              <option value="ONE_TIME">One-time</option>
                            </select>
                            <button
                              type="submit"
                              className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-xs font-medium hover:bg-primary-dark"
                            >
                              Add
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Expenses */}
                      {activeSubTab === "expenses" && (
                        <div className="space-y-3">
                          {details.expenses.map((item, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                            >
                              <p className="font-montserrat text-sm font-medium text-gray-900">
                                {item.category}
                              </p>
                              <p className="font-montserrat text-sm text-red-600 font-semibold">
                                {fmt(item.amount)} /{" "}
                                {item.frequency?.toLowerCase()}
                              </p>
                            </div>
                          ))}
                          <form
                            onSubmit={addExpense}
                            className="flex flex-wrap gap-2 items-end pt-2"
                          >
                            <input
                              className={`${inputClass} flex-1 min-w-[120px]`}
                              placeholder="Category"
                              required
                              value={expenseForm.category}
                              onChange={(e) =>
                                setExpenseForm({
                                  ...expenseForm,
                                  category: e.target.value,
                                })
                              }
                            />
                            <input
                              className={`${inputClass} flex-1 min-w-[140px]`}
                              placeholder="Description"
                              value={expenseForm.description}
                              onChange={(e) =>
                                setExpenseForm({
                                  ...expenseForm,
                                  description: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Amount"
                              required
                              value={expenseForm.amount}
                              onChange={(e) =>
                                setExpenseForm({
                                  ...expenseForm,
                                  amount: e.target.value,
                                })
                              }
                            />
                            <select
                              className={`${inputClass} w-32`}
                              value={expenseForm.frequency}
                              onChange={(e) =>
                                setExpenseForm({
                                  ...expenseForm,
                                  frequency: e.target.value,
                                })
                              }
                            >
                              <option value="MONTHLY">Monthly</option>
                              <option value="ANNUAL">Annual</option>
                              <option value="ONE_TIME">One-time</option>
                            </select>
                            <button
                              type="submit"
                              className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-xs font-medium hover:bg-primary-dark"
                            >
                              Add
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Assets */}
                      {activeSubTab === "assets" && (
                        <div className="space-y-3">
                          {details.assets.map((item, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-montserrat text-sm font-medium text-gray-900">
                                  {item.description}
                                </p>
                                <p className="font-montserrat text-xs text-gray-500">
                                  {item.asset_type}
                                </p>
                              </div>
                              <p className="font-montserrat text-sm text-emerald-600 font-semibold">
                                {fmt(item.value)}
                              </p>
                            </div>
                          ))}
                          <form
                            onSubmit={addAsset}
                            className="flex flex-wrap gap-2 items-end pt-2"
                          >
                            <input
                              className={`${inputClass} flex-1 min-w-[120px]`}
                              placeholder="Description"
                              required
                              value={assetForm.description}
                              onChange={(e) =>
                                setAssetForm({
                                  ...assetForm,
                                  description: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Value"
                              required
                              value={assetForm.value}
                              onChange={(e) =>
                                setAssetForm({
                                  ...assetForm,
                                  value: e.target.value,
                                })
                              }
                            />
                            <select
                              className={`${inputClass} w-32`}
                              value={assetForm.asset_type}
                              onChange={(e) =>
                                setAssetForm({
                                  ...assetForm,
                                  asset_type: e.target.value,
                                })
                              }
                            >
                              <option value="SAVINGS">Savings</option>
                              <option value="PROPERTY">Property</option>
                              <option value="INVESTMENT">Investment</option>
                              <option value="OTHER">Other</option>
                            </select>
                            <input
                              type="date"
                              className={`${inputClass} w-36`}
                              required
                              value={assetForm.acquisition_date}
                              onChange={(e) =>
                                setAssetForm({
                                  ...assetForm,
                                  acquisition_date: e.target.value,
                                })
                              }
                            />
                            <button
                              type="submit"
                              className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-xs font-medium hover:bg-primary-dark"
                            >
                              Add
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Liabilities */}
                      {activeSubTab === "liabilities" && (
                        <div className="space-y-3">
                          {details.liabilities.map((item, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-montserrat text-sm font-medium text-gray-900">
                                  {item.description}
                                </p>
                                <p className="font-montserrat text-xs text-gray-500">
                                  {item.liability_type} • {item.interest_rate}%
                                  interest
                                </p>
                              </div>
                              <p className="font-montserrat text-sm text-red-600 font-semibold">
                                {fmt(item.amount)}
                              </p>
                            </div>
                          ))}
                          <form
                            onSubmit={addLiability}
                            className="flex flex-wrap gap-2 items-end pt-2"
                          >
                            <input
                              className={`${inputClass} flex-1 min-w-[120px]`}
                              placeholder="Description"
                              required
                              value={liabilityForm.description}
                              onChange={(e) =>
                                setLiabilityForm({
                                  ...liabilityForm,
                                  description: e.target.value,
                                })
                              }
                            />
                            <select
                              className={`${inputClass} w-32`}
                              value={liabilityForm.liability_type}
                              onChange={(e) =>
                                setLiabilityForm({
                                  ...liabilityForm,
                                  liability_type: e.target.value,
                                })
                              }
                            >
                              <option value="LOAN">Loan</option>
                              <option value="CREDIT_CARD">Credit Card</option>
                              <option value="MORTGAGE">Mortgage</option>
                              <option value="OTHER">Other</option>
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Amount"
                              required
                              value={liabilityForm.amount}
                              onChange={(e) =>
                                setLiabilityForm({
                                  ...liabilityForm,
                                  amount: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-28`}
                              placeholder="Rate %"
                              value={liabilityForm.interest_rate}
                              onChange={(e) =>
                                setLiabilityForm({
                                  ...liabilityForm,
                                  interest_rate: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              step="0.01"
                              className={`${inputClass} w-32`}
                              placeholder="Monthly"
                              value={liabilityForm.monthly_payment}
                              onChange={(e) =>
                                setLiabilityForm({
                                  ...liabilityForm,
                                  monthly_payment: e.target.value,
                                })
                              }
                            />
                            <input
                              type="date"
                              className={`${inputClass} w-36`}
                              value={liabilityForm.payoff_date}
                              onChange={(e) =>
                                setLiabilityForm({
                                  ...liabilityForm,
                                  payoff_date: e.target.value,
                                })
                              }
                            />
                            <button
                              type="submit"
                              className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-xs font-medium hover:bg-primary-dark"
                            >
                              Add
                            </button>
                          </form>
                        </div>
                      )}
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
