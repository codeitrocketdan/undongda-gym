"use client";

import TypesSection from "./components/TypesSection";
import { useAdminTypesViewModel } from "./model/useAdminTypesViewModel";

export default function AdminTypesPage() {
  const viewModel = useAdminTypesViewModel();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">다짐 타입 관리</h1>
          <p className="mt-2 text-sm text-gray-500">
            다짐 타입을 추가하고 관리하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={viewModel.handleOpenAddModal}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          <span className="text-base leading-none">+</span>새 타입 추가
        </button>
      </div>
      <TypesSection {...viewModel} />
    </div>
  );
}
