import LoginModal from "@/shared/ui/modal/LoginModal";
import MoimModal from "@/shared/ui/modal/MoimModal";
import ProfileModal from "@/shared/ui/modal/ProfileModal";

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
