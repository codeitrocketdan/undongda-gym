import MeetingsSection from "./components/MeetingsSection";

export default function AdminMeetingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">다짐 리스트</h1>
        <p className="mt-2 text-sm text-gray-500">생성된 다짐을 관리하세요.</p>
      </div>
      <MeetingsSection />
    </div>
  );
}
