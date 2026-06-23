import { useRouter } from "next/navigation";
import Button from "../button/Button";
import Modal from "./Modal";
interface Props {
  onClose: () => void;
}
const SignupSuccessModal = ({ onClose }: Props) => {
  const router = useRouter();

  const handleSignup = () => {
    onClose();
    router.replace("/login");
    router.refresh();
  };
  return (
    <Modal onClose={onClose} isClickToClose size="sm">
      <Modal.Header className="flex-row justify-end">
        <Modal.CloseButton />
      </Modal.Header>
      <main className="py-1 text-center">
        <p className="text-2xl font-semibold text-slate-800">
          회원가입이 완료되었습니다.
        </p>
      </main>
      <Modal.Footer>
        <Button onClick={handleSignup}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignupSuccessModal;
