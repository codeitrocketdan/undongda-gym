"use client";

import Button from "@/shared/ui/button/Button";
import { Modal } from "@/shared/ui/modal";
import { parseAsString, useQueryState } from "nuqs";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { uploadImageToStorage } from "@/features/create-dagym/lib/uploadImage";
import { useUpdateDagymMutation } from "../../api/useUpdateDagymMutation";
import { DagymUpdateForm } from "../../model/types";
import DagymBasicInfo from "./DagymBasicInfo";
import DagymScheduleInfo from "./DagymScheduleInfo";

interface PropsType {
  id: string;
  onClose: () => void;
}

const TABS = [
  { id: 0, name: "기본 정보" },
  { id: 1, name: "일정 및 인원" },
];

export default function DagymUpdateModal({ id, onClose }: PropsType) {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("기본 정보")
  );
  const {
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<DagymUpdateForm>();

  const updateMutation = useUpdateDagymMutation(id);

  const onSubmit = async (values: DagymUpdateForm) => {
    let finalImageUrl = values.image as string;

    try {
      const imageFile = values.image as unknown;

      if (imageFile && imageFile instanceof File) {
        finalImageUrl = await uploadImageToStorage({ file: imageFile });
      }

      if (values.latitude == null || values.longitude == null) {
        alert("위치 좌표를 확인해 주세요.");
        return;
      }

      const finalPayload = {
        ...values,
        image: finalImageUrl,
        latitude: values.latitude,
        longitude: values.longitude,
        addressDetail: values.addressDetail,
      };

      updateMutation.mutate(finalPayload, {
        onSuccess: () => {
          onClose();
          alert("수정이 완료되었습니다.");
        },
      });
    } catch (error) {
      console.error("수정 프로세스 중 에러 발생:", error);
      alert("다짐 수정에 실패했습니다. 입력 값을 다시 확인해 주세요.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header className="mb-6 flex-row justify-between">
        <p className="text-lg-bold">다짐 수정하기</p>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <div className="mb-12 flex w-full border-b-2 border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.name)}
              className={twMerge(
                "-mb-0.5 w-1/2 flex-1 cursor-pointer border-b-2 px-8 py-2",
                activeTab === tab.name
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent"
              )}
            >
              <p className="text-xl-semibold">{tab.name}</p>
            </button>
          ))}
        </div>

        <form id="meeting-multi-step-form" onSubmit={handleSubmit(onSubmit)}>
          {activeTab === "기본 정보" && <DagymBasicInfo />}
          {activeTab === "일정 및 인원" && <DagymScheduleInfo />}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>

        <Button
          type="submit"
          form="meeting-multi-step-form"
          variant="primary"
          isDisabled={updateMutation.isPending || !isDirty}
        >
          {updateMutation.isPending ? "수정 중..." : "수정하기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
