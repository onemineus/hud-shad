"use client";
import { useState, useEffect } from "react";
import {
  useConnect,
  useEnsName,
  useAccount,
  useDisconnect,
  useSignMessage,
} from "wagmi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BiExit } from "react-icons/bi";
import { getAccessToken, getMessage } from "@huddle01/auth";
import { useAtom } from "jotai";
import { isCoach } from "@/lib/jotai/atoms";
import { Switch, Space } from "antd";

const NavBar = () => {
  const [isCoachPrivate, setIsCoachPrivate] = useAtom(isCoach);
  const [domLoaded, setDomLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div className="absolute px-6 top-0 left-0 h-16 bg-zinc-50 w-full flex items-center justify-between">
      <div className="text-xl font-mono">Huddle02</div>

      <div className="flex space-x-2 items-center h-full justify-center">
        <Switch
          className="bg-zinc-300"
          size="default"
          checkedChildren="Coach"
          unCheckedChildren="Stud"
          checked={isCoachPrivate}
          onChange={() => setIsCoachPrivate(!isCoachPrivate)}
        />
        {isConnected && domLoaded ? (
          <div className="flex justify-between items-center space-x-2">
            <div className="font-bold text-sm">{activeConnector?.name}</div>
            <div
              className="cursor-pointer"
              onClick={() => {
                disconnect();
                setAccessToken("");
              }}
            >
              <BiExit size={30} />
            </div>
          </div>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">Connect</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Connect to your wallet</AlertDialogTitle>
                <AlertDialogDescription>
                  What are wallets? How to connect them? Read more at docs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {connectors.map((connector) => {
                return (
                  <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="text-left bg-zinc-100 px-3 rounded py-2"
                  >
                    {connector.name}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (connecting)"}
                  </button>
                );
              })}
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default NavBar;
