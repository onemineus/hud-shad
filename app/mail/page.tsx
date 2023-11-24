"use client";

import React from "react";
import { Resend } from "resend";

const Page = () => {
  return (
    <div>
      <div
        className="cursor-pointer"
        onClick={async () => {
          const data = await fetch("http://127.0.0.1:3000/api/send", {
            method: "POST",
          });
          console.log(data);
          const a = await data.json();
          console.log(a);
        }}
      >
        ad
      </div>
    </div>
  );
};

const Email = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  return (
    <div>
      <div>Welcome, {firstName}!</div>
    </div>
  );
};

export default Page;
