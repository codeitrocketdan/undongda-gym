import CenterFilter from "./CenterFilter";
import SortFilter from "./SortFilter";

function Filter({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

export default Object.assign(Filter, {
  Center: CenterFilter,
  Sort: SortFilter,
});
