"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ActivitiesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // In accordance with Olympiad Digital Examination architecture,
    // interactive activities are question mechanisms managed in Question Repository.
    router.replace("/admin/questions");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 text-[#667085] text-xs font-bold">
      Redirecting to Question Repository...
    </div>
  );
}
