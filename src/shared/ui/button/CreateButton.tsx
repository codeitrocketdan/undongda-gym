import { Plus } from "lucide-react";
import Button from "./Button";

interface PropsType {
  onClick: () => void;
  children: React.ReactNode;
}

const CreateButton = ({ onClick, children }: PropsType) => {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={onClick}
      className="flex gap-1.5 rounded-3xl px-7 py-4"
    >
      <Plus />
      {children}
    </Button>
  );
};

export default CreateButton;
