import React from "react";
import Link from "next/link";

const BackButton = () => {
  return (
    <div className="absolute top-4 left-4">
      <Link href="/">
        <button className="text-blue-500">Back</button>
      </Link>
    </div>
  );
};

export default BackButton;
