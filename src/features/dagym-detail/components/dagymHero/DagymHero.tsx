"use client";
import { useAuth } from "@/app/providers/AuthClientProvider";
import { splitAddress } from "@/shared/lib/address";
import {
  formatDeadline,
  formatMonthDay,
  formatTime,
} from "@/shared/lib/formatDate";
import FeedCard from "@/shared/ui/feed-card/FeedCard";
import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";
import StatusLabel from "@/shared/ui/status-label/StatusLabel";
import Tag from "@/shared/ui/tag/Tag";
import { Crown, MapPin } from "lucide-react";
import Image from "next/image";

import { ConfirmModal, useModal } from "@/shared/ui/modal";
import { FormProvider, useForm } from "react-hook-form";
import { useDeleteDagymMutation } from "../../api/useDeleteDagymMutation";
import { Dagym, DagymUpdateForm } from "../../model/types";
import DagymHeroActions from "./DagymHeroActions";
import DagymHostMenu from "./DagymHostMenu";
import { DagymParticipants } from "./DagymParticipants";
import DagymUpdateModal from "./DagymUpdateModal";

interface PropsType {
  id: string;
  dagym: Dagym;
}

export default function DagymHero({ id, dagym }: PropsType) {
  const { user } = useAuth();
  const editModal = useModal();
  const deleteModal = useModal();

  const deleteMutation = useDeleteDagymMutation(id);
  const methods = useForm<DagymUpdateForm>({
    defaultValues: {
      name: "",
      type: "",
      region: "default",
      address: "",
      addressDetail: "",
      latitude: null,
      longitude: null,
      image: "",
      capacity: 0,
      dateTime: "",
      registrationEnd: "",
      description: "",
    },
  });
  if (!dagym) {
    return null;
  }

  const isHost = user?.id === dagym.hostId;

  const handleEdit = () => {
    const { address, addressDetail } = splitAddress(dagym.address ?? "");

    methods.reset({
      name: dagym.name,
      type: dagym.type,
      region: dagym.region,
      address,
      addressDetail,
      latitude: dagym.latitude ?? null,
      longitude: dagym.longitude ?? null,
      image: dagym.image ?? "",
      capacity: dagym.capacity ?? 0,
      dateTime: dagym.dateTime ?? "",
      registrationEnd: dagym.registrationEnd,
      description: dagym.description,
    });

    editModal.open();
  };

  const handleDelete = () => {
    deleteModal.open();
  };

  return (
    <>
      <section className="mb-20">
        <div className="flex flex-col gap-5 sm:h-[332px] sm:flex-row md:h-[433px]">
          <div className="relative h-[241px] w-full sm:h-full md:w-1/2">
            <Image
              src={dagym.image}
              alt={dagym.name}
              fill
              className="w-full rounded-4xl object-cover"
            />
          </div>

          <div className="flex w-full flex-col gap-5 md:h-full md:w-1/2">
            <FeedCard className="flex h-[282px] flex-col justify-between rounded-[28px] px-10 py-8 shadow-md">
              <div>
                <div className="relative mb-6 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <Tag
                      label={formatDeadline(dagym.registrationEnd)}
                      variant="deadline"
                    />
                    <Tag label={formatMonthDay(dagym.dateTime)} />
                    <Tag label={formatTime(dagym.dateTime)} />
                  </div>

                  {isHost && (
                    <DagymHostMenu
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <FeedCard.Title
                    title={dagym.name}
                    className="text-3xl-semibold mb-2"
                  />

                  {isHost && (
                    <Crown
                      size={30}
                      color="#00C3FF"
                      className="mb-2.5 shrink-0"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <MapPin className="h-3 w-3 shrink-0" />

                  <span className="truncate">
                    {dagym.region} · {dagym.type}
                  </span>
                </div>
              </div>

              <DagymHeroActions
                id={id}
                isFavorited={dagym.isFavorited}
                isJoined={dagym.isJoined}
                isHost={isHost}
                participantCount={dagym.participantCount}
                capacity={dagym.capacity}
                registrationEnd={dagym.registrationEnd}
              />
            </FeedCard>

            <div className="h-[141px] rounded-[28px] border border-blue-300 bg-blue-200 shadow-sm">
              <div className="px-10 py-7">
                <div className="mb-4 flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-lg-medium">
                      <span className="text-lg-bold text-blue-500">
                        {dagym.participantCount}
                      </span>{" "}
                      명 참여
                    </p>

                    <DagymParticipants meetingId={id} />
                  </div>
                  {dagym.participantCount >= 3 && <StatusLabel />}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-sm-medium text-slate-600">최소 3명</p>

                    <p className="text-sm-medium text-slate-600">
                      최대 {dagym.capacity}명
                    </p>
                  </div>

                  <ProgressBar
                    capacity={dagym.capacity}
                    participantCount={dagym.participantCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {editModal.isOpen && (
        <FormProvider {...methods}>
          <DagymUpdateModal id={id} onClose={editModal.close} />
        </FormProvider>
      )}
      {deleteModal.isOpen && (
        <ConfirmModal
          title="정말 다짐을 삭제하시겠습니까?"
          onConfirm={() => deleteMutation.mutate()}
          onCancel={deleteModal.close}
        ></ConfirmModal>
      )}
    </>
  );
}
