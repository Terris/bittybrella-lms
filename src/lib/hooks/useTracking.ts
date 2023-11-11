"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMe } from "../providers";

export function useTracking() {
  const { currentUser } = useMe();
  const trackMutation = useMutation(api.tracking.track);

  const trackEvent = async ({
    event,
    originatedFrom,
    metaData,
  }: {
    event: string;
    originatedFrom: string;
    metaData?: any;
  }) => {
    if (!currentUser) {
      return;
    }

    // all lowercase to normalize the data
    trackMutation({
      userId: currentUser.id,
      event: event.toLocaleLowerCase(),
      originatedFrom: originatedFrom.toLocaleLowerCase(),
      metaData,
    });
  };

  return { trackEvent };
}
