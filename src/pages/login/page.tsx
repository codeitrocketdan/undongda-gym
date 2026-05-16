"use client";
import IconButton from "@/shared/ui/IconButton";
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
    </div>
  );
};

export default LoginPage;
