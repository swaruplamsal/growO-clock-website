"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { calculatorsAPI } from "@/lib/api";

const calculatorTabs = [
  { key: "compound", label: "Compound Interest" },
  { key: "retirement", label: "Retirement" },
  { key: "loan", label: "Loan EMI" },
  { key: "investment", label: "Investment Growth" },
  { key: "tax", label: "Tax Estimation" },
];

function formatCurrency(num) {
  if (num === undefined || num === null) return "—";
  return Number(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState("compound");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Compound Interest
  const [compound, setCompound] = useState({
    principal: 100000,
    annual_rate: 12,
    years: 10,
    compounding_frequency: 12,
  });

  // Retirement
  const [retirement, setRetirement] = useState({
    current_age: 30,
    retirement_age: 60,
    monthly_expenses: 50000,
    current_savings: 500000,
    expected_return: 12,
    inflation_rate: 6,
  });

  // Loan
  const [loan, setLoan] = useState({
    principal: 2000000,
    annual_rate: 10,
    years: 20,
  });

  // Investment Growth
  const [investment, setInvestment] = useState({
    initial_investment: 100000,
    monthly_contribution: 10000,
    annual_return: 12,
    years: 15,
  });

  // Tax
  const [tax, setTax] = useState({
    annual_income: 1200000,
    deductions: 150000,
    filing_status: "individual",
  });

  const calculate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let res;
      switch (activeTab) {
        case "compound":
          res = await calculatorsAPI.compoundInterest(compound);
          break;
        case "retirement":
          res = await calculatorsAPI.retirement(retirement);
          break;
        case "loan":
          res = await calculatorsAPI.loan(loan);
          break;
        case "investment":
          res = await calculatorsAPI.investmentGrowth(investment);
          break;
        case "tax":
          res = await calculatorsAPI.taxEstimation(tax);
          break;
      }
      setResult(res.data);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = [];
        for (const [, val] of Object.entries(data)) {
          if (Array.isArray(val)) msgs.push(val.join(" "));
          else if (typeof val === "string") msgs.push(val);
        }
        setError(msgs.join(" ") || "Calculation failed.");
      } else {
        setError("Calculation failed. Please check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";
  const labelClass =
    "block font-montserrat text-sm font-medium text-gray-700 mb-1";

  const renderForm = () => {
    switch (activeTab) {
      case "compound":
        return (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Principal Amount (₹)</label>
              <input
                type="number"
                value={compound.principal}
                onChange={(e) =>
                  setCompound({ ...compound, principal: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={compound.annual_rate}
                onChange={(e) =>
                  setCompound({ ...compound, annual_rate: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Investment Period (Years)</label>
              <input
                type="number"
                value={compound.years}
                onChange={(e) =>
                  setCompound({ ...compound, years: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Compounding Frequency</label>
              <select
                value={compound.compounding_frequency}
                onChange={(e) =>
                  setCompound({
                    ...compound,
                    compounding_frequency: +e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value={1}>Annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select>
            </div>
          </div>
        );
      case "retirement":
        return (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Current Age</label>
              <input
                type="number"
                value={retirement.current_age}
                onChange={(e) =>
                  setRetirement({ ...retirement, current_age: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Retirement Age</label>
              <input
                type="number"
                value={retirement.retirement_age}
                onChange={(e) =>
                  setRetirement({
                    ...retirement,
                    retirement_age: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Monthly Expenses (₹)</label>
              <input
                type="number"
                value={retirement.monthly_expenses}
                onChange={(e) =>
                  setRetirement({
                    ...retirement,
                    monthly_expenses: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Current Savings (₹)</label>
              <input
                type="number"
                value={retirement.current_savings}
                onChange={(e) =>
                  setRetirement({
                    ...retirement,
                    current_savings: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Expected Return (%)</label>
              <input
                type="number"
                step="0.1"
                value={retirement.expected_return}
                onChange={(e) =>
                  setRetirement({
                    ...retirement,
                    expected_return: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Inflation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={retirement.inflation_rate}
                onChange={(e) =>
                  setRetirement({
                    ...retirement,
                    inflation_rate: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        );
      case "loan":
        return (
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Loan Amount (₹)</label>
              <input
                type="number"
                value={loan.principal}
                onChange={(e) =>
                  setLoan({ ...loan, principal: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={loan.annual_rate}
                onChange={(e) =>
                  setLoan({ ...loan, annual_rate: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Loan Period (Years)</label>
              <input
                type="number"
                value={loan.years}
                onChange={(e) => setLoan({ ...loan, years: +e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        );
      case "investment":
        return (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Initial Investment (₹)</label>
              <input
                type="number"
                value={investment.initial_investment}
                onChange={(e) =>
                  setInvestment({
                    ...investment,
                    initial_investment: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Monthly Contribution (₹)</label>
              <input
                type="number"
                value={investment.monthly_contribution}
                onChange={(e) =>
                  setInvestment({
                    ...investment,
                    monthly_contribution: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Expected Annual Return (%)</label>
              <input
                type="number"
                step="0.1"
                value={investment.annual_return}
                onChange={(e) =>
                  setInvestment({
                    ...investment,
                    annual_return: +e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Investment Period (Years)</label>
              <input
                type="number"
                value={investment.years}
                onChange={(e) =>
                  setInvestment({ ...investment, years: +e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        );
      case "tax":
        return (
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Annual Income (₹)</label>
              <input
                type="number"
                value={tax.annual_income}
                onChange={(e) =>
                  setTax({ ...tax, annual_income: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Deductions (₹)</label>
              <input
                type="number"
                value={tax.deductions}
                onChange={(e) =>
                  setTax({ ...tax, deductions: +e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Filing Status</label>
              <select
                value={tax.filing_status}
                onChange={(e) =>
                  setTax({ ...tax, filing_status: e.target.value })
                }
                className={inputClass}
              >
                <option value="individual">Individual</option>
                <option value="couple">Couple</option>
              </select>
            </div>
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!result) return null;
    const entries = Object.entries(result).filter(
      ([key]) =>
        !["schedule", "yearly_breakdown", "breakdown", "tax_slabs"].includes(
          key,
        ),
    );
    return (
      <div className="mt-8 bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h3 className="font-merriweather text-xl font-bold text-gray-900 mb-6">
          Results
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <p className="font-montserrat text-xs text-gray-400 mb-1 uppercase tracking-wider">
                {key.replace(/_/g, " ")}
              </p>
              <p className="font-merriweather text-lg font-bold text-primary">
                {typeof val === "number"
                  ? `₹ ${formatCurrency(val)}`
                  : String(val)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main>
      <Navbar />
      <PageHero
        title="Financial Calculators"
        subtitle="Plan your financial future with our powerful calculators."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {calculatorTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setResult(null);
                  setError("");
                }}
                className={`px-5 py-2.5 font-montserrat text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            {renderForm()}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-montserrat text-sm">
                {error}
              </div>
            )}

            <button
              onClick={calculate}
              disabled={loading}
              className="mt-6 px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Calculating...
                </span>
              ) : (
                "Calculate"
              )}
            </button>
          </div>

          {renderResult()}
        </div>
      </section>

      <Footer />
    </main>
  );
}
