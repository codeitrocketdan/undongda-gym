"use client";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import imgBusiness from "../assets/category-ex.png";

const mockOptions = [
  { imgUrl: imgBusiness, name: "맨몸운동" },
  { imgUrl: imgBusiness, name: "기구운동" },
  { imgUrl: imgBusiness, name: "런닝" },
  { imgUrl: imgBusiness, name: "클라이밍" },
  { imgUrl: imgBusiness, name: "파워리프팅" },
  { imgUrl: imgBusiness, name: "기타" },
];
export default function SetCategories() {
  const { register, watch } = useFormContext();
  const selectedValue = watch("category");

  //const [selectedValue, setSelectedValue] = useState("");
  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setSelectedValue(e.target.value);
  //   };

  return (
    <div className="select-category">
      <fieldset>
        <legend className="text-sm-medium ml-1 text-gray-800 after:ml-1 after:text-blue-500 after:content-['*']">
          이 모임은 어떤 종류인가요?
        </legend>

        <div className="my-3 grid grid-cols-3 gap-5">
          {mockOptions.map((item) => {
            return (
              <label key={item.name} className="cursor-pointer">
                <input
                  type="radio"
                  //name="dagymCategory"
                  value={item.name}
                  checked={selectedValue === item.name}
                  //onChange={handleChange}
                  {...register("category")}
                  className="peer sr-only"
                />
                <div className="flex h-34 w-34 flex-col items-center justify-center gap-2 rounded-xl border-gray-200 bg-gray-100 peer-checked:border-blue-400 peer-checked:bg-blue-200">
                  <Image src={item.imgUrl} alt="" />
                  <p>{item.name}</p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
