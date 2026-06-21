// "use client";

// import { useRouter } from "next/navigation";

// import Button from "@/shared/ui/button/Button";
// import { useQueryClient } from "@tanstack/react-query";
// import Modal from "./Modal";

// interface Props {
//   onClose: () => void;
// }

// export default function LogoutModal({ onClose }: Props) {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const handleLogout = async () => {
//     try {
//       const res = await fetch("/api/auth/logout", {
//         method: "POST",
//       });
//       if (!res.ok) {
//       }
//       queryClient.removeQueries({ queryKey: ["user"] });
//       queryClient.setQueryData(["user"], null);
//       onClose();

//       router.push("/");
//       router.refresh();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Modal onClose={onClose} isClickToClose>
//       <Modal.Header>
//         <Modal.CloseButton />
//       </Modal.Header>

//       <Modal.Body>
//       <div className="py-6">
//         <p className="text-center text-lg font-medium">
//           로그아웃 하시겠습니까?
//         </p>
//       </div>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>
//           취소
//         </Button>

//         <Button variant="primary" onClick={handleLogout}>
//           로그아웃
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }
