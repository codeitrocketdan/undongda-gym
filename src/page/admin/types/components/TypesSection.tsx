"use client";

import { MeetingTypeDTO } from "@/features/dagym/types";
import { DeleteConfirmModal } from "@/shared/ui/modal";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { CalendarX2 } from "lucide-react";
import { UseAdminTypesViewModelResult } from "../model/useAdminTypesViewModel";
import AddTypeModal from "./AddTypeModal";
import TypeCard from "./TypeCard";

function TypeGroup({
  title,
  types,
  onEdit,
  onDelete,
}: {
  title: string;
  types: MeetingTypeDTO[];
  onEdit: (type: MeetingTypeDTO) => void;
  onDelete: (type: MeetingTypeDTO) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-gray-700">
        {title}
        <span className="text-xs font-normal text-gray-400">
          {types.length}
        </span>
      </h3>
      {types.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
          등록된 타입이 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {types.map((type) => (
            <TypeCard
              key={type.id}
              type={type}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TypesSection({
  regularTypes,
  communityTypes,
  isEmpty,
  isLoading,
  modal,
  mode,
  name,
  category,
  imagePreview,
  isSubmitting,
  setName,
  setCategory,
  handleFileChange,
  handleSubmit,
  handleOpenAddModal,
  handleOpenEditModal,
  deleteModal,
  deletingType,
  isDeleting,
  handleOpenDeleteModal,
  handleConfirmDelete,
}: UseAdminTypesViewModelResult) {
  return (
    <section className="flex flex-col gap-8">
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
          <CalendarX2 size={48} strokeWidth={1.5} />
          <p className="text-sm">등록된 다짐 타입이 없어요.</p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            첫 타입 추가하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <TypeGroup
            title="정규수업"
            types={regularTypes}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
          <TypeGroup
            title="다모여짐"
            types={communityTypes}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </div>
      )}

      {modal.isOpen && (
        <AddTypeModal
          mode={mode}
          name={name}
          category={category}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
          onNameChange={setName}
          onCategoryChange={setCategory}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onClose={modal.close}
        />
      )}

      {deleteModal.isOpen && deletingType && (
        <DeleteConfirmModal
          title="정말 삭제하시겠습니까?"
          description={`'${deletingType.name}' 타입을 삭제하면 되돌릴 수 없습니다.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={deleteModal.close}
        />
      )}
    </section>
  );
}
