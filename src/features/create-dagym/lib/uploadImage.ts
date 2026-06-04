interface UploadImageParams {
  file: File;
}

export const uploadImageToStorage = async ({ file }: UploadImageParams): Promise<string> => {
  try {
    // Next.js API 라우터(/api/images)에게 Presigned URL 발급 요청 (POST)
    const tokenResponse = await fetch("/api/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Next.js 서버에서 URL 발급 실패: ${tokenResponse.statusText}`);
    }

    const { presignedUrl, publicUrl } = await tokenResponse.json(); // supabase url, https://~.jpg

    // 발급받은 supabase 주소(presignedUrl)로 진짜 파일 밀어넣기
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`스토리지 업로드 실패: ${uploadResponse.statusText}`);
    }

    // 성공하면 최종 저장된 publicUrl 반환
    return publicUrl;
  } catch (error) {
    console.error("이미지 스토리지 업로드 실패:", error);
    throw error;
  }
};
