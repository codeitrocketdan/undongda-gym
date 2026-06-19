"use client";

import { UserReviewDTO } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import Button from "@/shared/ui/button/Button";
import Modal from "@/shared/ui/modal/Modal";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReviewDTO } from "../types";

type ReviewType = ReviewDTO | UserReviewDTO;

type WriteProps = {
  mode: "write";
  meetingId: number;
  onClose: () => void;
  onSuccess?: () => void;
};

type DetailProps = {
  mode: "detail";
  review: ReviewType;
  onClose: () => void;
};

type ReviewModalProps = WriteProps | DetailProps;

export default function ReviewModal(props: ReviewModalProps) {
  const { mode, onClose } = props;
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (mode !== "write") return;

    if (score === 0) {
      setError("평점을 선택해주세요");
      return;
    }
    if (!comment.trim()) {
      setError("리뷰 내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await clientFetcher.post(`/api/meetings/${props.meetingId}/reviews`, {
        score,
        comment,
      });
      props.onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayScore = mode === "detail" ? props.review.score : score;

  return (
    <Modal onClose={onClose}>
      <Modal.Header className="flex-row justify-between">
        <p className="text-2xl-semibold">
          {mode === "write" ? "리뷰 쓰기" : "리뷰"}
        </p>
        <Modal.CloseButton />
      </Modal.Header>

      <main>
        {/* 평점 섹션 */}
        <div className="mb-8">
          <p className="text-base-semibold mb-4 text-slate-800">
            만족스러운 경험이었나요?
            {mode === "write" && <span className="text-blue-500">*</span>}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) =>
              mode === "write" ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => setScore(index + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Heart
                    size={28}
                    className={
                      index < displayScore
                        ? "fill-blue-500 stroke-blue-500"
                        : "fill-none stroke-slate-400"
                    }
                  />
                </button>
              ) : (
                <Heart
                  key={index}
                  size={28}
                  className={
                    index < displayScore
                      ? "fill-blue-500 stroke-blue-500"
                      : "fill-none stroke-slate-400"
                  }
                />
              )
            )}
          </div>
        </div>

        {/* 리뷰 내용 섹션 */}
        <div className="mb-6">
          <p className="text-base-semibold mb-4 text-slate-800">
            좋았던 점을 자유롭게 적어주세요.
            {mode === "write" && <span className="text-blue-500">*</span>}
          </p>
          {mode === "write" ? (
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
              className="custom-scrollbar w-full resize-none rounded-lg bg-slate-100 p-4 text-sm text-slate-700 outline-none"
              rows={6}
            />
          ) : (
            <textarea
              name="comment"
              defaultValue={props.review.comment}
              readOnly
              className="custom-scrollbar w-full resize-none rounded-lg bg-slate-100 p-4 text-sm text-slate-700 outline-none"
              rows={6}
            />
          )}
        </div>

        {mode === "write" && error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}
      </main>

      <Modal.Footer>
        {mode === "write" ? (
          <>
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              isDisabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              isDisabled={isSubmitting || score === 0 || !comment.trim()}
            >
              {isSubmitting ? "작성 중..." : "확인"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                router.push(`/meetings/${props.review.meetingId}`);
              }}
              className="flex-1"
            >
              다짐 상세보기
            </Button>
            <Button onClick={onClose} className="flex-1">
              닫기
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
