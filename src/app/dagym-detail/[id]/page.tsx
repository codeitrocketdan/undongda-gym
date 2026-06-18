import DagymDetailPage from "@/page/dagym-detail/page";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <DagymDetailPage id={id} />;
}
