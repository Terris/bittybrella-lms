import { useRouter } from "next/router";
import { useEffect } from "react";

interface UseConditionalForwarderProps {
  skipCondition: boolean;
  forwardCondition: boolean;
  forwardTo: string;
}

export function useConditionalForwarder({
  skipCondition,
  forwardCondition,
  forwardTo,
}: UseConditionalForwarderProps) {
  const router = useRouter();
  useEffect(() => {
    if (skipCondition) return;
    if (forwardCondition) {
      router.replace(forwardTo);
    }
  }, [skipCondition, forwardCondition, forwardTo, router]);
}
