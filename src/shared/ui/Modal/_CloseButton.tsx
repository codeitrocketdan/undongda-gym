import { useModalContext } from "./_Modal";

interface Props {
  className?: string;
}

export default function CloseButton({ className }: Props) {
  // 내부 컴포넌트에서는 context 사용
  const { onClose } = useModalContext();
  return (
    <button className={`${className} self-end`} onClick={onClose}>
      {" "}
      X{" "}
    </button>
  );
}
