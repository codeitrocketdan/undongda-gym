"use client";

import { MeetingTypeDTO } from "@/features/dagym/types";
import { DeleteConfirmModal } from "@/shared/ui/modal";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { CalendarX2 } from "lucide-react";
import { useAdminTypesViewModel } from "../model/useAdminTypesViewModel";
import AddTypeModal from "./AddTypeModal";
import TypeCard from "./TypeCard";

function TypeGrid({
  types,
  onEdit,
  onDelete,
}: {
  types: MeetingTypeDTO[];
  onEdit: (type: MeetingTypeDTO) => void;
  onDelete: (type: MeetingTypeDTO) => void;
}) {
  if (types.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-gray-400">
        등록된 타입이 없어요.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {types.map((type) => (
        <TypeCard
          key={type.id}
          type={type}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function TypesSection() {
  const {
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
  } = useAdminTypesViewModel();

  return (
    <section className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">다짐 타입 목록</h2>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          <span className="text-base leading-none">+</span>새 타입 추가
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
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
        <>
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-700">
              정규수업
            </h3>
            <TypeGrid
              types={regularTypes}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-700">
              다모여짐
            </h3>
            <TypeGrid
              types={communityTypes}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          </div>
        </>
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
