import Button from "../button/Button";
import Modal from "./Modal";
interface Props {
  onClose: () => void;
}
const UpdateSuccessModal = ({ onClose }: Props) => {
  return (
    <Modal
      onClose={() => {
        onClose();
      }}
    >
      <Modal.Body>
        <p className="text-xl-semibold text-center">수정이 완료되었습니다</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            onClose();
          }}
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateSuccessModal;
