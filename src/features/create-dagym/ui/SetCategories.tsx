"use client";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { useCategoryOptions } from "../model/useCategoryOptions";
export default function SetCategories() {
  const { register, watch } = useFormContext();
  const selectedValue = watch("type");
  const categoryOptions = useCategoryOptions();

  return (
    <div className="select-category">
      <fieldset>
        <legend className="text-sm-medium ml-1 text-gray-800 after:ml-1 after:text-blue-500 after:content-['*']">
          이 모임은 어떤 종류인가요?
        </legend>

        <div className="my-3 grid grid-cols-3 gap-2 md:gap-5">
          {categoryOptions.map((item) => {
            return (
              <label key={item.name} className="cursor-pointer">
                <input
                  type="radio"
                  value={item.name}
                  checked={selectedValue === item.name}
                  {...register("type")}
                  className="peer sr-only"
                />
                <div className="flex h-34 w-full flex-col items-center justify-center gap-2 rounded-xl border-gray-200 bg-gray-100 peer-checked:border-blue-400 peer-checked:bg-blue-200 md:w-34">
                  <Image src={item.imgUrl} alt="" width={66} height={66} />
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
