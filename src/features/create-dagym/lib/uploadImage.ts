import { clientFetcher } from "@/shared/api/clientFetcher";

interface UploadImageParams {
  file: File;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
}

export const uploadImageToStorage = async ({
  file,
}: UploadImageParams): Promise<string> => {
  try {
    const { presignedUrl, publicUrl } =
      await clientFetcher.post<
        { fileName: string; contentType: string; folder: string },
        PresignedUrlResponse
      >("/api/images", {
        fileName: file.name,
        contentType: file.type,
        folder: "meetings",
      });

    // presignedUrl은 외부 Supabase 주소라 raw fetch 사용
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`스토리지 업로드 실패: ${uploadResponse.statusText}`);
    }

    return publicUrl;
  } catch (error) {
    console.error("이미지 스토리지 업로드 실패:", error);
    throw error;
  }
};
