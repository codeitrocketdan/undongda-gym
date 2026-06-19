"use client";

import { uploadImageToStorage } from "@/features/create-dagym/lib/uploadImage";
import { useMeetingTypes } from "@/features/dagym/model/useMeetingTypes";
import { MeetingTypeDTO } from "@/features/dagym/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  MeetingTypeCategory,
  parseMeetingTypeDescription,
  serializeMeetingTypeDescription,
} from "@/shared/lib/meetingTypeDescription";
import { meetingTypeQueries } from "@/shared/lib/queryKeys";
import { useModal } from "@/shared/ui/modal/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

interface TypePayload {
  name: string;
  description: string;
}

export function useAdminTypesViewModel() {
  const queryClient = useQueryClient();
  const modal = useModal();

  const deleteModal = useModal();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<MeetingTypeCategory>("regular");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [editingType, setEditingType] = useState<MeetingTypeDTO | null>(null);
  const [deletingType, setDeletingType] = useState<MeetingTypeDTO | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: types = [], isLoading } = useMeetingTypes();

  const { regularTypes, communityTypes } = useMemo(() => {
    const regular: MeetingTypeDTO[] = [];
    const community: MeetingTypeDTO[] = [];
    for (const type of types) {
      const category = parseMeetingTypeDescription(type.description).category;
      if (category === "regular") regular.push(type);
      else if (category === "community") community.push(type);
      else regular.push(type); // fallback: 관리 화면에서 숨기지 않음
    }
    return { regularTypes: regular, communityTypes: community };
  }, [types]);

  const { mutate: createType, isPending: isCreatePending } = useMutation({
    mutationFn: (payload: TypePayload) =>
      clientFetcher.post<TypePayload, MeetingTypeDTO>(
        "/api/meeting-types",
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingTypeQueries.all });
      modal.close();
      resetForm();
    },
  });

  const { mutate: updateType, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, ...payload }: TypePayload & { id: number }) =>
      clientFetcher.patch<TypePayload, MeetingTypeDTO>(
        `/api/meeting-types/${id}`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingTypeQueries.all });
      modal.close();
      resetForm();
    },
  });

  const { mutate: deleteType, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meeting-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingTypeQueries.all });
      deleteModal.close();
      setDeletingType(null);
    },
  });

  const resetForm = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setName("");
    setCategory("regular");
    setImageFile(null);
    setImagePreview(null);
    setEditingType(null);
  };

  const handleFileChange = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setImageFile(file);
    setImagePreview(nextUrl);
  };

  const handleOpenAddModal = () => {
    resetForm();
    modal.open();
  };

  const handleOpenEditModal = (type: MeetingTypeDTO) => {
    setEditingType(type);
    setName(type.name);
    setImageFile(null);
    const { category: existingCategory, imageUrl } =
      parseMeetingTypeDescription(type.description);
    setCategory(existingCategory === "unknown" ? "regular" : existingCategory);
    setImagePreview(imageUrl || null);
    modal.open();
  };

  const handleOpenDeleteModal = (type: MeetingTypeDTO) => {
    setDeletingType(type);
    deleteModal.open();
  };

  const handleConfirmDelete = () => {
    if (!deletingType) return;
    deleteType(deletingType.id);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const existingImageUrl = editingType
      ? parseMeetingTypeDescription(editingType.description).imageUrl
      : "";

    if (!editingType && !imageFile) return;

    let finalImageUrl = existingImageUrl;

    if (imageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadImageToStorage({ file: imageFile });
      } catch {
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const payload = {
      name: name.trim(),
      description: serializeMeetingTypeDescription(category, finalImageUrl),
    };

    if (editingType) {
      updateType({ id: editingType.id, ...payload });
    } else {
      createType(payload);
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  return {
    regularTypes,
    communityTypes,
    isEmpty: types.length === 0,
    isLoading,
    modal,
    mode: editingType ? ("edit" as const) : ("add" as const),
    name,
    category,
    imagePreview,
    isSubmitting: isUploading || isCreatePending || isUpdatePending,
    setName,
    setCategory,
    handleFileChange,
    handleSubmit,
    handleOpenAddModal,
    handleOpenEditModal,
    deleteModal,
    deletingType,
    isDeleting: isDeletePending,
    handleOpenDeleteModal,
    handleConfirmDelete,
  };
}
