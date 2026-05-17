"use client";
import Button, { sizes } from "@/shared/ui/button/Button";
import CreateButton from "@/shared/ui/button/CreateButton";
import IconButton from "@/shared/ui/button/IconButton";
import { Camera, Heart, Pencil } from "lucide-react";

const LoginPage = () => {
  return (
    <div>
      <div></div>
      <IconButton size="sm" className="bg-blue-500 text-white" onClick={() => console.log("test")}>
        <Camera size={50} />
      </IconButton>
      <IconButton size="md" onClick={() => console.log("test")} iconClassName="w-10 h-10">
        <Pencil />
      </IconButton>
      <IconButton size="lg" onClick={() => console.log("test")}>
        <Heart />
      </IconButton>
      <Button onClick={() => console.log("test")} className={`sm:${sizes.md} md:${sizes.lg}`}>
        반응형 버튼 테스트
      </Button>
      <CreateButton>모임 만들기</CreateButton>
    </div>
  );
};

export default LoginPage;
