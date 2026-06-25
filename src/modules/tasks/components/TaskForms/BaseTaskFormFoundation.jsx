import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "../../schemas";

/**
 * Base Task Form Foundation
 * Integrates react-hook-form with Zod validation.
 * This is an architectural template for complex forms.
 */
export function BaseTaskFormFoundation({ defaultValues, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      estimatedMinutes: null,
      statusId: null,
      priorityId: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          {...register("title")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="e.g. Design homepage mockup"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Detailed requirements..."
        />
      </div>

      {/* Complex Input Example (e.g. custom Select integration via Controller) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Controller
            name="statusId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Status</option>
                <option value={1}>To Do</option>
                <option value={2}>In Progress</option>
              </select>
            )}
          />
          {errors.statusId && (
            <p className="mt-1 text-xs text-red-600">{errors.statusId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Est. Minutes
          </label>
          <input
            type="number"
            {...register("estimatedMinutes", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {errors.estimatedMinutes && (
            <p className="mt-1 text-xs text-red-600">{errors.estimatedMinutes.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
