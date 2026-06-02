import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";

export default function SetDescribe() {
  return (
    <InputField label="모임 설명" htmlFor="dagymDescription">
      <Input type="text" id="dagymDescription" placeholder="모임을 설명해주세요" />
    </InputField>
  );
}
