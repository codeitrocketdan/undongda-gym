export type MeetingTypeCategory = "regular" | "community" | "unknown";

interface TypeDescriptionData {
  category: MeetingTypeCategory;
  imageUrl: string;
}

export const parseMeetingTypeDescription = (
  description: string | null
): TypeDescriptionData => {
  try {
    const parsed = JSON.parse(description ?? "");
    return {
      category: parsed.category ?? "unknown",
      imageUrl: parsed.imageUrl ?? "",
    };
  } catch {
    return { category: "unknown", imageUrl: "" };
  }
};

export const serializeMeetingTypeDescription = (
  category: TypeDescriptionData["category"],
  imageUrl: string
): string => {
  return JSON.stringify({ category, imageUrl });
};
