import { formatDate } from "@/shared/lib/formatDate";
import Author from "@/shared/ui/author/Author";
import { Dagym } from "../../model/types";

interface Props {
  dagym: Dagym;
}

const DagymDescription = ({ dagym }: Props) => {
  const { host } = dagym;
  return (
    <section className="mb-20 hidden md:block">
      <h2 className="text-2xl-semibold mb-5">다짐 설명</h2>

      <div className="rounded-4xl bg-white px-12 pt-4 pb-8">
        <div className="flex items-center gap-1.5">
          <Author name={host.name} image={host.image} />
          <span className="text-xs text-slate-500 md:text-sm">
            {formatDate(dagym.createdAt)}
          </span>
        </div>
        <p className="text-base-regular mt-6.5 text-gray-700">
          {dagym.description}
        </p>
      </div>
    </section>
  );
};

export default DagymDescription;
