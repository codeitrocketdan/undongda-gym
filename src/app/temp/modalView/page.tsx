import LoginModal from "@/shared/ui/Modal/LoginModal";
import MoimModal from "@/shared/ui/Modal/MoimModal";
import ProfileModal from "@/shared/ui/Modal/ProfileModal";

const ModalView = () => {
  return (
    <div>
      <LoginModal />
      <ProfileModal />
      <MoimModal />
    </div>
  );
};

export default ModalView;
