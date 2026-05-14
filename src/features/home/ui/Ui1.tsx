import React from "react";

const Ui1 = () => {
  return (
    <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
      <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
        To get started, edit the page.tsx file.
      </h1>
      <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Looking for a starting point or more instructions? Head over to{" "}
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="font-medium text-zinc-950 dark:text-zinc-50"
        >
          Templates
        </a>{" "}
        or the{" "}
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="font-medium text-zinc-950 dark:text-zinc-50"
        >
          Learning
        </a>{" "}
        center.
      </p>
    </div>
  );
};

export default Ui1;
