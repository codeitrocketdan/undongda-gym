import { useModalContext } from "./_Modal";

export default function ModalBackground() {
  const { onClose } = useModalContext();
  const isClickToClose = true;
  return (
    <div
      onClick={isClickToClose ? onClose : () => {}}
      className="bg-close flex h-screen w-full bg-black opacity-50"
    />
  );
}
