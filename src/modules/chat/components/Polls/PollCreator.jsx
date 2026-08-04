import React, { useState, useCallback } from "react";
import { X, Plus, Trash2, Vote } from "lucide-react";
import { toast } from "sonner";
import { useCreatePollMutation } from "../../mutations/chat.mutations";

const PollCreator = React.memo(({ conversationId, onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const createMutation = useCreatePollMutation();

  const handleAddOption = useCallback(() => {
    setOptions(opts => [...opts, ""]);
  }, []);

  const handleRemoveOption = useCallback((index) => {
    setOptions(opts => opts.filter((_, idx) => idx !== index));
  }, []);

  const handleOptionChange = useCallback((index, value) => {
    setOptions(opts => {
      const next = [...opts];
      next[index] = value;
      return next;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    const filteredOptions = options.map(o => o.trim()).filter(Boolean);
    if (filteredOptions.length < 2) {
      toast.error("Please provide at least 2 options.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        conversationId,
        dto: {
          question: question.trim(),
          options: filteredOptions,
          allowMultiple,
          isAnonymous,
        }
      });
      toast.success("Poll created successfully.");
      if (onClose) onClose();
    } catch (err) {
      toast.error("Failed to create poll.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Vote className="h-4.5 w-4.5" />
            <span>Create Poll</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 bg-slate-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5 mb-0.5">
              Options
            </label>
            <div className="max-h-36 overflow-y-auto flex flex-col gap-2 pr-0.5">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-slate-50"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-1 self-start flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add Choice
            </button>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-3.5">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-slate-600 font-semibold group-hover:text-slate-800 transition-colors">
                Allow Multiple Answers
              </span>
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-slate-600 font-semibold group-hover:text-slate-800 transition-colors">
                Anonymous Votes
              </span>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.01] cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Creating..." : "Launch Poll"}
          </button>
        </form>
      </div>
    </div>
  );
});

PollCreator.displayName = "PollCreator";

export default PollCreator;
