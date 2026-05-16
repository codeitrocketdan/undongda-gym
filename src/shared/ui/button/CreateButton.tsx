import { Plus } from "lucide-react";
import Button from "./Button";

interface PropsType {
  children: React.ReactNode;
}

const CreateButton = ({ children }: PropsType) => {
  return (
    <Button
      variant="primary"
      size="md"
      resposive="md-md"
      onClick={() => console.log("test")}
      className="flex gap-1.5 rounded-3xl px-7 py-4"
    >
      <Plus />
      {children}
    </Button>
  );
};

export default CreateButton;
