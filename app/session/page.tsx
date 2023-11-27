"use client";

import { accessToken } from "@/lib/jotai/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import { IoMicOffOutline } from "react-icons/io5";
import { IoMicOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { IoVideocamOffOutline } from "react-icons/io5";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";

const Page = () => {
  const router = useRouter();
  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [isPeerMuted, setIsPeerMuted] = useState(false);
  useEffect(() => {
    // if (accessTokenPrivate === "") {
    //   router.push("/");
    // }
  }, [accessTokenPrivate]);

  return (
    <div className="relative min-h-screen">
      <div className="h-16 w-full absolute border-b border-zinc-800 top-0 bg-zinc-950 flex items-center px-6 text-slate-100 justify-between">
        <div className="text-xl font-bold">Huddle</div>
        <div className="text-sm">something</div>
      </div>
      <div className="h-screen bg-gray-950 pt-16 text-slate-100">
        <div className="bg-pink-950 grid grid-cols-3 h-full rounded-lg">
          <div className="bg-zinc-950 col-span-2 space-y-4 h-full flex flex-col p-4">
            <div className="bg-zinc-900 rounded-xl h-full w-full p-0">
              <div className="bg-gray-800 relative h-full w-full rounded-xl overflow-hidden">
                <video
                  autoPlay={true}
                  loop={true}
                  muted
                  src={"./one.mp4"}
                  className="h-full absolute object-cover rounded-xl"
                />
                <div className="absolute backdrop-blur-md bottom-4 left-4 bg-zinc-800 bg-opacity-20 rounded-lg px-3 py-2">
                  {"Narendra Modi"}
                </div>
                <div className="absolute backdrop-blur-md bottom-4 right-4 bg-zinc-800 bg-opacity-20 rounded-full p-1">
                  {isPeerMuted ? (
                    <div
                      onClick={() => {
                        setIsPeerMuted(!isPeerMuted);
                      }}
                      className="bg-orange-70 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <IoMicOffOutline className="h-full w-full" />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setIsPeerMuted(!isPeerMuted);
                      }}
                      className="bg-zinc-70 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <IoMicOutline className="h-full w-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 px-6 justify-between h-20 w-full rounded-xl flex items-center">
              <div className="bg-zinc-700 space-x-2 px-3 items-center rounded-lg py-2 flex">
                <div className="text-xs">{"jha-dsd-erd"}</div>
                <div className="w-[1px] h-4 bg-zinc-500"></div>
                <div className="cursor-pointer">
                  <IoCopyOutline />
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                {/* mic */}
                {isMicEnabled ? (
                  <div
                    onClick={() => {
                      setIsMicEnabled(!isMicEnabled);
                    }}
                    className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <IoMicOffOutline className="h-full w-full" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setIsMicEnabled(!isMicEnabled);
                    }}
                    className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <IoMicOutline className="h-full w-full" />
                  </div>
                )}
                {/* video */}
                {isVideoEnabled ? (
                  <div
                    onClick={() => {
                      setIsVideoEnabled(!isVideoEnabled);
                    }}
                    className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <IoVideocamOffOutline className="h-full w-full" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setIsVideoEnabled(!isVideoEnabled);
                    }}
                    className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <IoVideocamOutline className="h-full w-full" />
                  </div>
                )}
                {/* screen share */}
                {isScreenShareEnabled ? (
                  <div
                    onClick={() => {
                      setIsScreenShareEnabled(!isScreenShareEnabled);
                    }}
                    className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <MdOutlineStopScreenShare className="h-full w-full" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setIsScreenShareEnabled(!isScreenShareEnabled);
                    }}
                    className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <MdOutlineScreenShare className="h-full w-full" />
                  </div>
                )}
                {/* menu */}
                <div
                  onClick={() => {}}
                  className="bg-sky-600 cursor-pointer p-2 h-9 w-9 rounded"
                >
                  <PiDotsThreeOutlineVerticalLight className="h-full w-full" />
                </div>
              </div>
              <div className="bg-orange-700 px-3 py-2 cursor-pointer rounded-lg text-xs capitalize">
                leave meet
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 flex flex-col space-y-4 h-full col-span-1 p-4 border-l border-zinc-800">
            <div className="w-full bg-zinc-900 aspect-video rounded-xl p-4">
              <div className="w-full relative aspect-video rounded-lg">
                <video
                  autoPlay={true}
                  loop={true}
                  muted
                  src={"./two.mp4"}
                  className="h-full absolute w-full object-cover rounded-lg"
                />
                <div className="absolute backdrop-blur-md bottom-4 left-4 bg-zinc-800 bg-opacity-20 rounded-lg px-3 py-2">
                  {"You"}
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 w-full flex flex-col space-y-4 h-full p-4 rounded-xl">
              <div className="bg-sky-600 w-full space-x-2 p-4 px-4 rounded-lg f flex items-center">
                <div className="capitalize font-semibold">participants</div>
                <div className="bg-sky-700 text-center w-5 rounded">{2}</div>
              </div>
              <div className="bg-zinc-700 px-4 w-full h-14 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <img
                    src="./two.png"
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="text-zinc-100 text-xs font-semibold">
                      {"You"}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {"0x4432ds5t...4E8Bf7"}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-full p-1 cursor-pointer">
                  <PiDotsThreeOutlineVerticalLight />
                </div>
              </div>
              <div className="bg-zinc-700 px-4 w-full h-14 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <img
                    src="./one.png"
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="text-zinc-100 text-xs font-semibold">
                      {"Narendra Modi"}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {"0x4E8Bfs5t...74432d"}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-full p-1 cursor-pointer">
                  <PiDotsThreeOutlineVerticalLight />
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
