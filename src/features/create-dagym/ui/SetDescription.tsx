import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import { useFormContext } from "react-hook-form";

export default function SetDescribe() {
  const { register } = useFormContext();
  return (
    <InputField label="모임 설명" htmlFor="dagymDescription">
      <Input
        type="text"
        id="dagymDescription"
        placeholder="모임을 설명해주세요"
        {...register("description")}
      />
    </InputField>
  );
}
