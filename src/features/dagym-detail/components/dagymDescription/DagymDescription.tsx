"use client";

import { formatDate } from "@/shared/lib/formatDate";
import Author from "@/shared/ui/author/Author";
import { ProfileModal, useProfileModal } from "@/shared/ui/modal";
import { Dagym } from "../../model/types";

interface Props {
  dagym: Dagym;
}

const DagymDescription = ({ dagym }: Props) => {
  const { host } = dagym;
  const profileModal = useProfileModal();

  return (
    <section className="mb-20 hidden md:block">
      <h2 className="text-2xl-semibold mb-5">모임 설명</h2>

      <div className="rounded-4xl bg-white px-12 pt-4 pb-8">
        <div className="flex items-center gap-1.5">
          <Author
            name={host.name}
            image={host.image}
            onClick={() => profileModal.open(host.id)}
          />
          <span className="text-xs text-slate-500 md:text-sm">
            {formatDate(dagym.createdAt)}
          </span>
        </div>
        <p className="text-base-regular mt-6.5 text-gray-700">
          {dagym.description}
        </p>
      </div>

      {profileModal.isOpen && profileModal.userId !== null && (
        <ProfileModal
          mode="read"
          userId={profileModal.userId}
          onClose={profileModal.close}
        />
      )}
    </section>
  );
};

export default DagymDescription;
