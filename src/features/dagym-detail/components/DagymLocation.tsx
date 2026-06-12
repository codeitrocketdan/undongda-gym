import { Dagym } from "../model/types";

interface Props {
  dagym: Dagym;
}

const DagymLocation = ({ dagym }: Props) => {
  return (
    <section className="mb-20">
      <h2 className="text-2xl-semibold mb-5">모임 장소</h2>
      <div className="rounded-4xl border border-gray-200 bg-white px-4 py-3.5 sm:px-8 sm:py-5.5">
        <div className="-mx-4 -my-3.5 mb-3.5 h-[280px] rounded-t-4xl bg-blue-300 sm:-mx-8 sm:-my-5.5 sm:mb-5.5">
          카카오 지도
        </div>
        <p className="text-base-regular text-gray-700">{dagym.address}</p>
      </div>
    </section>
  );
};

export default DagymLocation;
