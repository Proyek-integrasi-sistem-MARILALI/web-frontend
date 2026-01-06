import { useRef } from "react";
import { ChevronRight, User } from "lucide-react";

/**
 * Step 1: Date, Budget, and Person selection
 */
const DateBudgetStep = ({ formData, setFormData }) => {
  const startInputRef = useRef(null);
  const finishInputRef = useRef(null);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Choose Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleBudgetChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = parseInt(value).toLocaleString("id-ID");
    }
    console.log('[BUDGET CHANGE] New budget value:', value);
    setFormData({ ...formData, budget: value });
  };

  const adjustPerson = (delta) => {
    const newCount = Math.max(1, formData.personCount + delta);
    console.log('[PERSON CHANGE] New person count:', newCount);
    setFormData((prev) => ({
      ...prev,
      personCount: newCount,
    }));
  };

  return (
    <div className="border border-gray-400 rounded-xl p-8 shadow-sm">
      {/* Date Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Date</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="cursor-pointer"
            onClick={() => startInputRef.current?.showPicker()}
          >
            <p className="text-xl mb-2 font-medium">Start</p>
            <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
              <input
                type="date"
                ref={startInputRef}
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => {
                  console.log('[DATE CHANGE] Start date:', e.target.value);
                  setFormData({ ...formData, startDate: e.target.value });
                }}
              />
              <div className="flex justify-between items-center w-full">
                <span
                  className={
                    formData.startDate
                      ? "text-black text-xl font-semibold"
                      : "text-gray-400 text-xl"
                  }
                >
                  {formatDateDisplay(formData.startDate)}
                </span>
                <ChevronRight className="h-6 w-6 text-black" />
              </div>
            </div>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => finishInputRef.current?.showPicker()}
          >
            <p className="text-xl mb-2 font-medium">Finish</p>
            <div className="relative border border-black rounded-lg h-14 flex items-center px-4">
              <input
                type="date"
                ref={finishInputRef}
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => {
                  console.log('[DATE CHANGE] Finish date:', e.target.value);
                  setFormData({ ...formData, finishDate: e.target.value });
                }}
              />
              <div className="flex justify-between items-center w-full">
                <span
                  className={
                    formData.finishDate
                      ? "text-black text-xl font-semibold"
                      : "text-gray-400 text-xl"
                  }
                >
                  {formatDateDisplay(formData.finishDate)}
                </span>
                <ChevronRight className="h-6 w-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Budget</h2>
        <div className="border border-black rounded-lg h-14 flex items-center px-4 gap-1">
          <span className="text-xl font-normal flex-shrink-0">Set Budget (Rp</span>
          <input
            type="text"
            value={formData.budget}
            onChange={handleBudgetChange}
            placeholder="1.000.000"
            className="flex-1 min-w-0 text-xl outline-none bg-transparent placeholder:text-gray-400"
          />
          <span className="text-xl font-normal flex-shrink-0">)</span>
        </div>
      </div>

      {/* Person Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Person</h2>
        <div className="flex items-center justify-between border border-black rounded-lg px-4 h-14">
          <div className="flex items-center gap-3">
            <User className="h-7 w-7 text-black fill-current" />
            <span className="text-xl font-bold">
              {formData.personCount}
            </span>
            <ChevronRight className="h-6 w-6 text-black" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustPerson(-1)}
              className="text-2xl font-bold border border-black rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-100"
            >
              -
            </button>
            <button
              onClick={() => adjustPerson(1)}
              className="text-2xl font-bold border border-black rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateBudgetStep;
