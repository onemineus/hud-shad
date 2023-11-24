"use client";

import { accessToken } from "@/lib/jotai/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { HiDotsCircleHorizontal } from "react-icons/hi";

const Page = () => {
  const router = useRouter();
  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);

  useEffect(() => {
    if (accessTokenPrivate === "") {
      router.push("/");
    }
  }, [accessTokenPrivate]);

  return (
    <div className="relative min-h-screen">
      <div className="h-16 w-full absolute top-0 bg-slate-950 flex items-center px-6 text-slate-100 justify-between">
        <div className="text-xl font-bold">Huddle</div>
        <div className="text-sm">something</div>
      </div>
      <div className="h-screen p-4 bg-slate-900 pt-20 text-slate-100">
        <div className="h-full w-full space-y-4 flex-col flex p-4 bg-slate-950 rounded-2xl">
          <div className="w-full bg-slate-300 rounded-xl h-2/3 flex relative">
            <div className="text-slate-950 flex items-center justify-between bottom-0 p-2 left-0 right-0 absolute">
              <div className="capitalize outline outline-1 text-sm bg-slate-100 font-bold rounded-full px-3 py-1 text-">
                narendra modi
              </div>
              <div className="flex pr- space-x-4 items-center">
                <div>asd</div>
                <div>asd</div>
                <div className="cursor-pointer" onClick={() => {}}>
                  <HiDotsCircleHorizontal size={34} color="white" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full space-x-4 bg-slate-20 rounded-xl h-1/3 flex">
            <div className="bg-slate-300 h-full w-[30rem] rounded-lg relative">
              <div className="text-slate-950 flex items-center justify-between bottom-0 p-2 left-0 right-0 absolute">
                <div className="capitalize outline outline-1 text-sm bg-slate-100 font-bold rounded-full px-3 py-1 text-">
                  you
                </div>
                <div className="flex pr- space-x-4 items-center">
                  <div>asd</div>
                  <div>asd</div>
                  <div className="cursor-pointer" onClick={() => {}}>
                    <HiDotsCircleHorizontal size={34} color="white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-300 w-[30rem] rounded-lg relative">
              <div className="text-slate-950 flex items-center justify-between bottom-0 p-2 left-0 right-0 absolute">
                <div className="capitalize outline outline-1 text-sm bg-slate-100 font-bold rounded-full px-3 py-1 text-">
                  screen share
                </div>
                <div className="flex pr- space-x-4 items-center">
                  <div>asd</div>
                  <div>asd</div>
                  <div className="cursor-pointer" onClick={() => {}}>
                    <HiDotsCircleHorizontal size={34} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
